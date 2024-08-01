import { Coordinate } from 'ol/coordinate';

import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { FilePlacementMode } from '../../data/file-placement/file-placement.models';
import { defaultOlProjectionCode } from '../../data/projections/projections.models';
import {
  extractTableNameFromComplexName,
  extractTableNameFromFeatureId
} from '../../geoserver/featureType/featureType.util';
import { CoordinateEdited, WfsFeature } from '../../geoserver/wfs/wfs.models';
import { CrgLayer, CrgLayerType, CrgRasterLayer, CrgVectorLayer, NewCrgLayer } from './layers.models';

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
    nativeCRS: defaultOlProjectionCode,
    mode: FilePlacementMode.GIS,
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
    nativeCRS: defaultOlProjectionCode,
    type: CrgLayerType.EXTERNAL
  };
}

export function getLayerByFeatureInCurrentProject(
  feature: WfsFeature<Coordinate | CoordinateEdited>
): CrgVectorLayer | undefined {
  return currentProject.vectorableLayers.find(
    ({ tableName }) => tableName === extractTableNameFromFeatureId(feature.id)
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
