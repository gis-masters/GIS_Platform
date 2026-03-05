import { SelectProjectionCodeControl } from '../../../components/SelectProjectionCodeControl/SelectProjectionCodeControl';
import { type FilePlacementMode } from '../../data/file-placement/file-placement.models';
import { PropertyType, type SimpleSchema } from '../../data/schema/schema.models';
import { type CrgProject } from '../projects/projects.models';

// TODO: пронаследовать от common-contracts.d.ts LayerType ? в базе куча 'vector' и т.д. (Azure №3970)
export enum CrgLayerType {
  VECTOR = 'vector',
  DXF = 'dxf',
  TAB = 'tab',
  MID = 'mid',
  SHP = 'shp',
  RASTER = 'raster',
  EXTERNAL = 'external',
  EXTERNAL_NSPD = 'external_nspd',
  EXTERNAL_GEOSERVER = 'external_geoserver'
}

interface CrgEntity {
  id: number;
  title: string;
  enabled?: boolean;
  position?: number;
  transparency?: number;
}

interface CrgBaseLayer extends CrgEntity {
  type: CrgLayerType;
  nativeCRS: string;
  resourceId: string;
  minZoom?: number;
  maxZoom?: number;
  complexName?: string;
  parentId?: number;
  errorText?: string;
  mode?: FilePlacementMode;
}

export interface CrgLayersGroup extends CrgEntity {
  expanded?: boolean;
  parentId?: number;
}

export interface CrgRasterLayer extends CrgBaseLayer {
  type: CrgLayerType.RASTER;
  mode: FilePlacementMode;
  dataStoreName?: string;
  dataSourceUri?: string;
  sourceId: string;
  sourceType: SourceType;
  sourceRecordId: number;
  parentId?: number;
  enabled?: boolean;
  nativeName?: string;
}

export type SourceType = 'document' | 'feature';

export interface CrgVectorLayer extends CrgBaseLayer {
  type: CrgLayerType.VECTOR;
  dataStoreName?: string;
  styleName?: string;
  style?: string;
  dataset: string;
  view?: string;
  photoMode?: string;
}

export function isVectorLayer(layer?: CrgLayer): layer is CrgVectorLayer {
  return layer?.type === CrgLayerType.VECTOR;
}

export interface CrgVectorableLayer extends CrgBaseLayer {
  type: CrgLayerType.VECTOR | CrgLayerType.DXF | CrgLayerType.MID | CrgLayerType.SHP | CrgLayerType.TAB;
  dataStoreName?: string;
  dataset?: string;
  styleName?: string;
  style?: string;
}

export interface CrgExternalLayer extends CrgBaseLayer {
  type: CrgLayerType.EXTERNAL | CrgLayerType.EXTERNAL_GEOSERVER | CrgLayerType.EXTERNAL_NSPD;
  dataSourceUri: string;
}

export interface RelatedVectorLayers {
  layer: CrgVectorLayer;
  project: CrgProject;
}

export type CrgLayer = Partial<
  Omit<CrgRasterLayer, 'type'> & Omit<CrgVectorLayer, 'type'> & Omit<CrgExternalLayer, 'type'> & CrgBaseLayer
> &
  CrgEntity;

export type NewCrgLayer = Partial<CrgLayer>;

export const crgLayerSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title: 'Наименование',
      propertyType: PropertyType.STRING
    },
    {
      name: 'minZoom',
      title: 'Минимальный уровень масштабирования',
      maxValue: 40,
      description: 'Слой будет скрыт при уровне масштаба меньше указанного',
      propertyType: PropertyType.INT
    },
    {
      name: 'maxZoom',
      title: 'Максимальный уровень масштабирования',
      maxValue: 40,
      description: 'Слой будет скрыт при уровне масштаба больше указанного',
      propertyType: PropertyType.INT
    },
    {
      name: 'nativeCRS',
      title: 'Координатная система',
      propertyType: PropertyType.CUSTOM,
      ControlComponent: SelectProjectionCodeControl
    }
  ]
};
