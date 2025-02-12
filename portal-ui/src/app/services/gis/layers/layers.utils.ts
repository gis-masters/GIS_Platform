import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { defaultOlProjectionCode } from '../../data/projections/projections.models';
import {
  extractTableNameFromComplexName,
  extractTableNameFromFeatureId
} from '../../geoserver/featureType/featureType.util';
import { WfsFeature } from '../../geoserver/wfs/wfs.models';
import { CrgLayer, CrgLayerType, CrgVectorLayer, NewCrgLayer } from './layers.models';

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

export function externalLayerDefaults(): Pick<
  NewCrgLayer,
  'nativeCRS' | 'enabled' | 'position' | 'transparency' | 'minZoom' | 'maxZoom' | 'type'
> {
  return {
    ...defaultProps,
    nativeCRS: defaultOlProjectionCode,
    type: CrgLayerType.EXTERNAL
  };
}

export function getLayerByFeatureInCurrentProject(feature: WfsFeature): CrgVectorLayer | undefined {
  return getLayerByFeatureIdFromCurrentProject(feature.id);
}

export function getLayerByFeatureIdFromCurrentProject(featureId: string): CrgVectorLayer | undefined {
  return currentProject.vectorableLayers.find(
    ({ tableName }) => tableName === extractTableNameFromFeatureId(featureId)
  );
}

export function getLayerByComplexNameInCurrentProject(complexName: string): CrgVectorLayer | undefined {
  return currentProject.vectorableLayers.find(l => l.complexName === complexName);
}

export function generateNextLayerId(): number {
  return Math.max(...currentProject.layers.map(({ id }) => id), 0) + 1;
}

export function isVectorFromFile(type: CrgLayerType | undefined): boolean {
  return (
    type === CrgLayerType.DXF || type === CrgLayerType.SHP || type === CrgLayerType.TAB || type === CrgLayerType.MID
  );
}

export function isLayerFromFile(layer: CrgLayer | NewCrgLayer): boolean {
  return (
    layer.type === CrgLayerType.RASTER ||
    layer.type === CrgLayerType.MID ||
    layer.type === CrgLayerType.TAB ||
    layer.type === CrgLayerType.SHP ||
    layer.type === CrgLayerType.DXF
  );
}

export function convertComplexNamesArrayToTableNamesUriFragment(complexNames: string[]): string {
  return complexNames.map(extractTableNameFromComplexName).join(',');
}
