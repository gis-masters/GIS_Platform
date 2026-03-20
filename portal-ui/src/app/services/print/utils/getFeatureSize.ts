import { defaultOlProjectionCode, type Projection } from '../../data/projections/projections.models';
import { getProjectionCode } from '../../data/projections/projections.util';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { isLinear, isPolygonal } from '../../geoserver/wfs/wfs.util';
import { getFeatureArea, getFeatureLength } from '../../map/labels/map-labels.util';
import { mapService } from '../../map/map.service';
import { UnitsOfAreaMeasurement, wfsFeatureToFeature } from '../../util/open-layers.util';

type FeatureSizeParams = {
  feature: WfsFeature;
  projection: Projection;
  units?: string;
};

export type FeatureSize = {
  value: number;
  units: string;
  sizeType: 'area' | 'length';
};

export function getFeatureSize({ feature: wfsFeature, projection }: FeatureSizeParams): FeatureSize | undefined {
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
      const [value, units] = getFeatureArea({
        geometry,
        projection: getProjectionCode(projection) === defaultOlProjectionCode ? projection : undefined,
        units: UnitsOfAreaMeasurement.HECTARE
      });

      return { value, units, sizeType: 'area' };
    } else if (isLinear(type)) {
      const [value, units] = getFeatureLength({ geometry, projection, precision: mapService.PRECISION });

      return { value, units, sizeType: 'length' };
    }
  }
}
