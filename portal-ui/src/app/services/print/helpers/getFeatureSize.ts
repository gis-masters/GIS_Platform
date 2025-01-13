import { defaultOlProjectionCode, Projection } from '../../data/projections/projections.models';
import { getProjectionCode } from '../../data/projections/projections.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { isLinear, isPolygonal } from '../../geoserver/wfs/wfs.util';
import { getFeatureArea, getFeatureLength } from '../../map/labels/map-labels.util';
import { mapService } from '../../map/map.service';
import { UnitsOfAreaMeasurement, wfsFeatureToFeature } from '../../util/open-layers.util';

type FeatureSizeData = {
  feature: WfsFeature;
  projection: Projection;
  units?: string;
};

type ReturnGetFeatureSizeData =
  | {
      value: number;
      units: string;
      sizeType?: 'area';
    }
  | undefined;

export function getFeatureSize({ feature: wfsFeature, projection }: FeatureSizeData): ReturnGetFeatureSizeData {
  let sizeType: 'area' | undefined;

  const feature = wfsFeatureToFeature(wfsFeature);
  const geometry = feature.getGeometry();

  if (!geometry) {
    throw new Error('Ошибка геометрии объекта');
  }

  if (wfsFeature.geometry) {
    const {
      geometry: { type }
    } = wfsFeature;

    if (isPolygonal(type)) {
      sizeType = 'area';
      const [value, units] = getFeatureArea({
        geometry,
        projection: getProjectionCode(projection) === defaultOlProjectionCode ? projection : undefined,
        units: UnitsOfAreaMeasurement.HECTARE
      });

      return { value, units, sizeType };
    } else if (isLinear(type)) {
      const [value, units] = getFeatureLength({ geometry, projection, precision: mapService.PRECISION });

      return { value, units, sizeType };
    }
  }
}
