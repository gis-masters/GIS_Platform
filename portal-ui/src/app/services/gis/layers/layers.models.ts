import { FilePlacementMode } from '../../data/file-placement/file-placement.models';
import { PropertyType, SimpleSchema } from '../../data/schema/schema.models';

export enum CrgLayerType {
  VECTOR = 'vector',
  VECTOR_FROM_FILE = 'vectorFromFile',
  RASTER = 'raster',
  EXTERNAL = 'external',
  EXTERNAL_GEOSERVER = 'external_geoserver'
}

interface CrgEntity {
  title: string;
  id?: number;
  enabled?: boolean;
  position?: number;
  transparency?: number;
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
  libraryId: string;
  recordId: number;
  parentId?: number;
  enabled?: boolean;
}

export interface CrgVectorLayer extends CrgBaseLayer {
  type: CrgLayerType.VECTOR;
  dataStoreName?: string;
  schemaId: string;
  styleName?: string;
  dataset: string;
  view?: string;
}

export interface CrgExternalLayer extends CrgBaseLayer {
  type: CrgLayerType.EXTERNAL | CrgLayerType.EXTERNAL_GEOSERVER;
  dataSourceUri: string;
}

export type CrgLayer = Partial<
  Omit<CrgRasterLayer, 'type'> & Omit<CrgVectorLayer, 'type'> & Omit<CrgExternalLayer, 'type'> & CrgBaseLayer
> &
  CrgEntity;

interface CrgBaseLayer extends CrgEntity {
  type: CrgLayerType;
  nativeCRS: string;
  tableName: string;
  minZoom?: number;
  maxZoom?: number;
  complexName?: string;
  parentId?: number;
  errorText?: string;
}

export type NewCrgLayer = Partial<CrgLayer>;

export const crgLayerSchema: SimpleSchema = {
  properties: [
    {
      name: 'title',
      title: 'Название слоя',
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
    }
  ]
};
