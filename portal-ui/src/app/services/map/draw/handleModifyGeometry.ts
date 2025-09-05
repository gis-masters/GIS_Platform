import { isBoolean } from 'lodash';

import { GeometryType } from '../../geoserver/wfs/wfs.models';
import { mergeToMultiLineString, mergeToMultiPoint, mergeToMultiPolygon } from '../../ol/marge-geometries';
import { featureToWfsFeature } from '../../util/open-layers.util';
import { sleep } from '../../util/sleep';
import { editFeatureStore } from '../a-map-mode/edit-feature/EditFeatureStore';
import { FeatureState } from '../map.models';
import { mapDrawService } from './map-draw.service';

// Используем события модификации и рисования просто как маркеры.
// При возникновении этих событий мы посмотрим на источник данных и считаем оттуда все фичи, которые сейчас там есть.
export async function handleGeometry(): Promise<void> {
  await sleep(0);

  // В источнике может быть много фичей - все которые выделены(selectedFeature).
  // Но при редактировании мы работаем только с одной активной фичей(isActiveFeature).
  // Поэтому мы отфильтровываем из источника только фичи, которые относятся к активной фиче и те фичи что были
  // нарисованы: они не имеют никаких маркеров.
  const allFeatures = mapDrawService.getDrawSource().getFeatures();

  const activeAndNewFeatures = allFeatures.filter(feature => {
    const selectedFeature: unknown = feature.get(FeatureState.SELECTED);
    const isActiveFeature: unknown = feature.get(FeatureState.ACTIVE);
    const isEmptyFeature: unknown = feature.get(FeatureState.EMPTY);

    const isEmpty = isBoolean(isEmptyFeature) ? isEmptyFeature : false;
    const isActive = isBoolean(isActiveFeature) ? isActiveFeature : false;
    const isSelectedFeature = isBoolean(selectedFeature) ? selectedFeature : false;

    // Включаем активную фичу или все фичи, которые не являются выбранными (для снеппинга)
    return isActive || (!isSelectedFeature && !isEmpty);
  });

  let feature;

  switch (editFeatureStore.geometryType) {
    case GeometryType.POLYGON:
    case GeometryType.MULTI_POLYGON: {
      feature = mergeToMultiPolygon(activeAndNewFeatures, editFeatureStore.currentProjection);

      break;
    }
    case GeometryType.LINE_STRING:
    case GeometryType.MULTI_LINE_STRING: {
      feature = mergeToMultiLineString(activeAndNewFeatures, editFeatureStore.currentProjection);

      break;
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      feature = mergeToMultiPoint(activeAndNewFeatures, editFeatureStore.currentProjection);

      break;
    }
    default: {
      throw new Error('Не поддерживаемый тип геометрии: ' + editFeatureStore.geometryType);
    }
  }

  if (feature) {
    const wfsFeature = featureToWfsFeature(feature);

    if (wfsFeature.geometry) {
      editFeatureStore.setGeometry(wfsFeature.geometry, true, 'Изменение на карте');
      await mapDrawService.syncFeatureGeometryWithMap();
    }
  }
}
