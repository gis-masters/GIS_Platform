import { Role } from './permissions.models';
import { PropertySchema, PropertyType } from './schema.models';

export enum CrgLayerType {
  VECTOR = 'vector',
  RASTER = 'raster',
  EXTERNAL = 'external',
  EXTERNAL_GEOSERVER = 'external_geoserver'
}

interface CrgEntity {
  id?: number;
  title: string;
  enabled: boolean;
  position: number;
  transparency: number;
}

export interface CrgLayer extends CrgEntity {
  dataset?: string;
  dataStoreName?: string;
  tableName?: string;
  type: CrgLayerType;
  minZoom?: number;
  maxZoom?: number;
  styleName?: string;
  nativeCRS: string;
  schemaId?: string;
  complexName?: string;
  dataSourceUri?: string;
  parentId?: number;
  libraryId?: string;
  recordId?: number;
}

export type NewCrgLayer = Pick<
  CrgLayer,
  | 'id'
  | 'title'
  | 'dataStoreName'
  | 'dataset'
  | 'complexName'
  | 'tableName'
  | 'enabled'
  | 'parentId'
  | 'minZoom'
  | 'maxZoom'
  | 'nativeCRS'
  | 'transparency'
  | 'dataSourceUri'
  | 'styleName'
  | 'position'
  | 'schemaId'
  | 'type'
>;

export interface CrgLayersGroup extends CrgEntity {
  parentId?: number;
  expanded: boolean;
}

export type NewCrgLayersGroup = Pick<
  CrgLayersGroup,
  'id' | 'title' | 'enabled' | 'transparency' | 'position' | 'parentId' | 'expanded'
>;

export type TreeItemPayload = CrgLayer | NewCrgLayer | CrgLayersGroup | NewCrgLayersGroup;

export interface TreeItem<T = TreeItemPayload> {
  id: number;
  payload: T;
  isGroup: boolean;
  isEmptyGroup?: boolean;
  depth?: number;
  visible?: boolean;
  hiddenByZoom?: boolean;
  parent?: TreeItem<CrgLayersGroup>;
  actualTransparency?: number;
  errors?: string[];
}

export interface CrgProject {
  id: number;
  name: string;
  internalName: string;
  bbox: string;
  default: boolean;
  order: number;
  organizationId: number;
  createdAt: string;
  role: Role;
}

export const crgProjectSchema: PropertySchema<CrgProject>[] = [
  {
    propertyType: PropertyType.STRING,
    title: 'Название',
    name: 'name',
    required: true,
    minLength: 3,
    maxLength: 250
  }
];
