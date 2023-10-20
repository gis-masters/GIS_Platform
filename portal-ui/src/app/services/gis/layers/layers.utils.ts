import { Coordinate } from 'ol/coordinate';

import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { CoordinateEdited, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { CrgLayerType, CrgRasterLayer, CrgVectorLayer, NewCrgLayer } from './layers.models';

const defaultProps = {
  enabled: true,
  position: -42,
  transparency: 75,
  minZoom: 3,
  maxZoom: 25
};

export function vectorLayerDefaults(): Pick<
  CrgVectorLayer,
  'dataStoreName' | 'complexName' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
> {
  return {
    ...defaultProps,
    dataStoreName: currentUser.workspaceName,
    complexName: undefined,
    type: CrgLayerType.VECTOR
  };
}

export function rasterLayerDefaults(): Pick<
  CrgRasterLayer,
  'nativeCRS' | 'mode' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
> {
  return {
    ...defaultProps,
    nativeCRS: 'EPSG:3857',
    mode: 'gis-service',
    enabled: true,
    type: CrgLayerType.RASTER
  };
}

export function externalLayerDefaults(): Pick<
  NewCrgLayer,
  'nativeCRS' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
> {
  return {
    ...defaultProps,
    nativeCRS: 'EPSG:3857',
    type: CrgLayerType.EXTERNAL
  };
}

export function getLayerByFeatureInCurrentProject(
  feature: WfsFeature<Coordinate | CoordinateEdited>
): CrgVectorLayer | undefined {
  const [tableName] = feature.id.split('.');

  return currentProject.vectorableLayers.find(l => l.tableName === tableName);
}

export function getLayerByComplexNameInCurrentProject(complexName: string): CrgVectorLayer | undefined {
  return currentProject.vectorableLayers.find(l => l.complexName === complexName);
}

export function generateNextLayerId(): number {
  return Math.max(...currentProject.layers.map(({ id }) => id), 0) + 1;
}

export function isVectorFromFile(type: CrgLayerType): boolean {
  return type === CrgLayerType.DXF || type === CrgLayerType.SHP;
}
