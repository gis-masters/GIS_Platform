import { currentUser } from '../stores/CurrentUser.store';
import { CrgLayerType, NewCrgLayer } from './crg/projects.models';

const defaultProps = {
  enabled: true,
  position: -42,
  transparency: 75,
  minZoom: 10,
  maxZoom: 26
};

export function vectorLayerDefaults(): Pick<
  NewCrgLayer,
  'id' | 'dataStoreName' | 'complexName' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
> {
  const dataStoreName = `scratch_database_${currentUser.orgId}`;

  return {
    ...defaultProps,
    dataStoreName,
    id: undefined,
    complexName: undefined,
    type: CrgLayerType.VECTOR
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
