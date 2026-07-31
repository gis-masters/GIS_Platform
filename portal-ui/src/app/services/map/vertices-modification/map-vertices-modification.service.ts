import Collection from 'ol/Collection';
import { type SnapEvent } from 'ol/events/SnapEvent';
import type Feature from 'ol/Feature';
import { type Geometry } from 'ol/geom';
import { Modify } from 'ol/interaction';
import { type ModifyEvent } from 'ol/interaction/Modify';

import { Toast } from '../../../components/Toast/Toast';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { selectedFeaturesStore } from '../../../stores/SelectedFeatures.store';
import { communicationService } from '../../communication.service';
import { type Projection } from '../../data/projections/projections.models';
import { projectionCodeToProjection } from '../../data/projections/projections.util';
import { updateFeature } from '../../data/vectorData/vectorData.service';
import { extractFeatureId } from '../../geoserver/featureType/featureType.util';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { isExternalLayer } from '../../gis/layers/layers.typeguards';
import {
  getLayerByFeatureIdFromCurrentProject,
  getLayerByFeatureInCurrentProject
} from '../../gis/layers/layers.utils';
import { isUpdateAllowed } from '../../permissions/permissions.service';
import { services } from '../../services';
import { transformGeometryToLayerProjectionInWfsFeature } from '../../util/coordinates-transform.util';
import { featureToWfsFeature } from '../../util/open-layers.util';
import { getVertexRemover } from '../../util/vertex/VertexRemoverFactory';
import { mapDrawService } from '../draw/map-draw.service';
import { mapService } from '../map.service';
import { mapSnapService } from '../snap/map-snap.service';
import { getStyle, KnownStyleKey } from '../styles/map-styles';

class MapVerticesModificationService {
  private static _instance: MapVerticesModificationService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private modify?: Modify;

  private verticesModification = {
    init: (allowedFeatures: Feature<Geometry>[]) => {
      this.verticesModification.destroy();

      this.modify = new Modify({
        features: new Collection(allowedFeatures)
      });
      mapService.map.addInteraction(this.modify);

      this.verticesModification.setEvents();
    },
    setEvents: () => {
      this.modify?.on('modifyend', (e: ModifyEvent) => {
        mapVerticesModificationStore.updateModifiedCollection(e.features.getArray());
      });
    },
    setActive: (active: boolean) => {
      this.modify?.setActive(active);
    },
    reset: () => {
      this.modify?.setActive(false);
      this.modify?.setActive(true);
    },
    destroy: () => {
      if (this.modify) {
        this.modify.setActive(false);
        mapService.map.removeInteraction(this.modify);
        this.modify = undefined;
      }
    }
  };

  async resolveUpdatableFeatureIds(features: WfsFeature[]): Promise<string[]> {
    const layerAllowed = new Map<number, boolean>();
    const updatableIds: string[] = [];

    for (const feature of features) {
      const layer = getLayerByFeatureInCurrentProject(feature);
      if (!layer) {
        continue;
      }

      let allowed = layerAllowed.get(layer.id);
      if (allowed === undefined) {
        allowed = await isUpdateAllowed(layer);
        layerAllowed.set(layer.id, allowed);
      }

      if (allowed) {
        updatableIds.push(feature.id);
      }
    }

    mapVerticesModificationStore.setUpdatableFeatureIds(updatableIds);

    return updatableIds;
  }

  async verticesModificationOn(): Promise<boolean> {
    const updatableIds = await this.resolveUpdatableFeatureIds(selectedFeaturesStore.features);
    if (updatableIds.length === 0) {
      return false;
    }

    const updatableIdSet = new Set(updatableIds);
    const allowedOlFeatures = mapDrawService
      .getDrawSource()
      .getFeatures()
      .filter(feature => updatableIdSet.has(String(feature.getId())));

    if (allowedOlFeatures.length === 0) {
      return false;
    }

    communicationService.minimizeAttributesBar.emit();

    this.verticesModification.init(allowedOlFeatures);
    this.verticesModification.setActive(true);

    mapSnapService.activate();
    communicationService.snapDblClick.on((event: CustomEvent<SnapEvent>) => this.handleDblClick(event), this);

    return true;
  }

  verticesModificationOff() {
    mapVerticesModificationStore.updateModifiedCollection([]);
    void mapDrawService.reDrawFeatures(selectedFeaturesStore.features);

    this.verticesModification.destroy();

    mapSnapService.deactivate();
    communicationService.off(this);
  }

  async verticesModificationClear(simple?: boolean) {
    if (simple) {
      this.verticesModification.reset();

      return;
    }

    mapVerticesModificationStore.updateModifiedCollection([]);
    await mapDrawService.reDrawFeatures(selectedFeaturesStore.features);
    const features = await mapDrawService.getFeatures();
    features.forEach(feature => {
      feature.setStyle(getStyle(KnownStyleKey.SelectedFeaturesWithVertices));
    });

    this.verticesModification.reset();
  }

  async save(modifiedFeatures: Feature<Geometry>[]) {
    if (!projectionsStore.olProjection) {
      services.logger.error('Не заданы ol-проекция, необходимые для трансформации координат');

      return;
    }

    mapVerticesModificationStore.saveOn();

    const savedFeatures: WfsFeature[] = [];
    let notSavedCounter = 0;
    for (const feature of modifiedFeatures) {
      const featureId = String(feature.getId());
      const layer = getLayerByFeatureIdFromCurrentProject(featureId);
      if (!layer || isExternalLayer(layer)) {
        services.logger.warn('Не найден слой для фичи: ' + featureId);

        continue;
      }

      if (!(await isUpdateAllowed(layer))) {
        services.logger.warn('Нет прав на обновление фичи: ' + featureId);
        notSavedCounter++;

        continue;
      }

      const savedFeature = await this.saveFeature(feature, layer, projectionsStore.olProjection);
      if (savedFeature === null) {
        notSavedCounter++;
      } else {
        savedFeatures.push(savedFeature);
      }
    }

    if (notSavedCounter > 0) {
      Toast.warn(`Не удалось обновить ${notSavedCounter} фичи`);
    }

    // После успешного сохранения, обновим фичи на карте.
    void mapDrawService.drawMoreFeatures(savedFeatures);
    await this.verticesModificationClear(true);

    // Вызываем рефреш для обновления картинки (WMS). (Рефрешим ВСЁ - можно оптимальнее)
    mapService.refreshAllLayers();
    mapVerticesModificationStore.updateModifiedCollection([]);
    const features = await mapDrawService.getFeatures();
    features.forEach(feature => {
      feature.setStyle(getStyle(KnownStyleKey.SelectedFeaturesWithVertices));
    });

    mapVerticesModificationStore.saveOff();
  }

  private handleDblClick(event: CustomEvent<SnapEvent>) {
    if (event.detail === null) {
      return;
    }

    const { vertex, feature } = event.detail;
    if (vertex === undefined || feature === undefined) {
      return;
    }

    if (!mapVerticesModificationStore.updatableFeatureIds.includes(String(feature.getId()))) {
      return;
    }

    const vertexRemover = getVertexRemover(feature);
    if (vertexRemover !== null) {
      vertexRemover.removeVertex(feature, vertex);
      mapVerticesModificationStore.updateModifiedCollection([feature]);
    }
  }

  private async saveFeature(
    feature: Feature<Geometry>,
    layer: CrgVectorLayer,
    olProjection: Projection
  ): Promise<WfsFeature | null> {
    const featureId = String(feature.getId());

    try {
      const wfsFeature = featureToWfsFeature(feature);

      transformGeometryToLayerProjectionInWfsFeature(
        wfsFeature,
        olProjection,
        projectionCodeToProjection(layer.nativeCRS)
      );

      await updateFeature(layer.dataset, layer.resourceId, {
        id: String(extractFeatureId(featureId)),
        type: 'Feature',
        geometry: wfsFeature.geometry,
        properties: {}
      });

      return wfsFeature;
    } catch {
      services.logger.error(`Не удалось выполнить сохранение фичи: ${featureId}`);

      return null;
    }
  }
}

export const mapVerticesModificationService = MapVerticesModificationService.instance;
