import { currentUser } from '../../stores/CurrentUser.store';
import { CrgLayerType, CrgRasterLayer, CrgVectorLayer, NewCrgLayer } from './projects/projects.models';

const defaultProps = {
  enabled: true,
  position: -42,
  transparency: 75,
  minZoom: 3,
  maxZoom: 25
};

export function vectorLayerDefaults(): Pick<
  CrgVectorLayer,
  'id' | 'dataStoreName' | 'complexName' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
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
  'id' | 'nativeCRS' | 'mode' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
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
