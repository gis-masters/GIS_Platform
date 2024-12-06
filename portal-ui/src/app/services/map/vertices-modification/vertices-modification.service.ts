import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';

import { Toast } from '../../../components/Toast/Toast';
import { mapVerticesModificationStore } from '../../../stores/MapVerticesModification.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { Projection } from '../../data/projections/projections.models';
import {
  projectionCodeToProjection,
  transformGeometryToLayerProjectionInWfsFeature
} from '../../data/projections/projections.util';
import { updateFeature } from '../../data/vectorData/vectorData.service';
import { extractFeatureId } from '../../geoserver/featureType/featureType.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerByFeatureIdFromCurrentProject } from '../../gis/layers/layers.utils';
import { services } from '../../services';
import { featureToWfsFeature } from '../../util/open-layers.util';
import { mapService } from '../map.service';

class MapVerticesModificationService {
  private static _instance: MapVerticesModificationService;
  static get instance() {
    return this._instance || (this._instance = new this());
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
    void mapService.highlightMoreFeatures(savedFeatures);
    mapService.verticesModificationClear(true);

    // Вызываем рефреш для обновления картинки (WMS). (Рефрешим ВСЁ - можно оптимальнее)
    mapService.refreshAllLayers();
    mapVerticesModificationStore.updateModifiedCollection([]);

    mapVerticesModificationStore.saveOff();
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
        properties: wfsFeature.properties
      });

      return wfsFeature;
    } catch {
      services.logger.error(`Не удалось выполнить сохранение фичи: ${featureId}`);

      return null;
    }
  }
}

export const mapVerticesModificationService = MapVerticesModificationService.instance;
