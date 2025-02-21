import { SnapEvent } from 'ol/events/SnapEvent';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { Modify } from 'ol/interaction';
import { ModifyEvent } from 'ol/interaction/Modify';

import { Toast } from '../../../components/Toast/Toast';
import { mapStore } from '../../../stores/Map.store';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { communicationService } from '../../communication.service';
import { Projection } from '../../data/projections/projections.models';
import { projectionCodeToProjection } from '../../data/projections/projections.util';
import { updateFeature } from '../../data/vectorData/vectorData.service';
import { extractFeatureId } from '../../geoserver/featureType/featureType.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerByFeatureIdFromCurrentProject } from '../../gis/layers/layers.utils';
import { services } from '../../services';
import { transformGeometryToLayerProjectionInWfsFeature } from '../../util/coordinates-transform.util';
import { featureToWfsFeature } from '../../util/open-layers.util';
import { getVertexRemover } from '../../util/vertex/VertexRemoverFactory';
import { konfirmieren } from '../../utility-dialogs.service';
import { mapDrawService } from '../draw/map-draw.service';
import { MapMode } from '../map.models';
import { mapService } from '../map.service';
import { mapSnapService } from '../snap/map-snap.service';

class MapVerticesModificationService {
  private static _instance: MapVerticesModificationService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private modify?: Modify;

  private verticesModification = {
    init: () => {
      this.modify = new Modify({
        source: mapDrawService.getDrawSource()
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
    }
  };

  verticesModificationOn() {
    // TODO: Мы не должны вызывать off каких то других режимов. Должен быть отдельный обработчик который рулит режимами.
    mapDrawService.drawOff();
    communicationService.minimizeAttributesBar.emit();

    mapStore.setMode(MapMode.VERTICES_MODIFICATION);

    this.verticesModification.init();
    this.verticesModification.setActive(true);

    mapSnapService.activate();
    communicationService.snapDblClick.on((event: CustomEvent<SnapEvent>) => this.handleDblClick(event), this);
  }

  verticesModificationOff() {
    if (mapVerticesModificationStore.modifiedFeatures.length > 0) {
      void konfirmieren({
        message: 'Все несохраненные данные будут утеряны.',
        okText: 'Всё равно закрыть',
        cancelText: 'Не закрывать'
      }).then(confirmed => {
        if (confirmed) {
          mapStore.setMode(MapMode.DEFAULT);
          void mapVerticesModificationStore.updateModifiedCollection([]);
          void mapDrawService.highlightFeatures(mapStore.selectedFeatures);

          this.verticesModification.setActive(false);

          mapSnapService.deactivate();
          communicationService.off(this);
        }
      });
    } else {
      mapStore.setMode(MapMode.DEFAULT);
      void mapVerticesModificationStore.updateModifiedCollection([]);
      void mapDrawService.highlightFeatures(mapStore.selectedFeatures);

      this.verticesModification.setActive(false);
      mapSnapService.deactivate();
      communicationService.off(this);
    }
  }

  verticesModificationClear(simple?: boolean) {
    if (simple) {
      this.verticesModification.reset();

      return;
    }

    void mapVerticesModificationStore.updateModifiedCollection([]);
    void mapDrawService.highlightFeatures(mapStore.selectedFeatures);
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
      if (layer === undefined) {
        services.logger.warn('Не найден слой для фичи: ' + featureId);

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
    void mapDrawService.highlightMoreFeatures(savedFeatures);
    this.verticesModificationClear(true);

    // Вызываем рефреш для обновления картинки (WMS). (Рефрешим ВСЁ - можно оптимальнее)
    mapService.refreshAllLayers();
    mapVerticesModificationStore.updateModifiedCollection([]);

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

      void transformGeometryToLayerProjectionInWfsFeature(
        wfsFeature,
        olProjection,
        projectionCodeToProjection(layer.nativeCRS)
      );

      await updateFeature(layer.dataset, layer.tableName, {
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
