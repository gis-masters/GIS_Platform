import { Coordinate } from 'ol/coordinate';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum MapMode {
  DEFAULT,
  DRAW,
  MEASURE,
  SELECTION,
  ADDING_LABEL,
  VERTICES_MODIFICATION
}

export enum MapAction {
  DRAW,
  PROKOL,
  LAYER_EYE,
  ADD_LAYER,
  CHECK_BUGS,
  EXPORT_GML,
  EXPORT_SHP,
  MAP_LABELS,
  MAP_MEASURE,
  ADD_FEATURE,
  SEARCH_FIELD,
  DELETE_LAYER,
  DELETE_GROUP,
  PRINT_MAP_PDF,
  MAP_SELECTION,
  ATTRIBUTES_TAB,
  ZOOM_TO_FEATURE,
  LAYER_FILTRATION,
  SELECT_BY_BORDER,
  OPEN_LAYER_SOURCE,
  OPEN_EDIT_FEATURE,
  RENAME_LAYER_GROUP,
  CREATE_LAYER_GROUP,
  EDIT_PROJECT_LAYER,
  OPEN_ATTRIBUTE_TABLE,
  OPEN_IMPORTS_SUBMENU,
  OPEN_LAYER_PROPERTIES,
  VERTICES_MODIFICATION,
  LAYER_SIDEBAR_LEFT_TOOLS,
  SELECT_WITH_MODIFICATORS
}

export enum FilterBySelectionMode {
  ONLY_SELECTED = 'selected',
  ONLY_NOT_SELECTED = 'notSelected',
  DISABLED = 'disabled'
}

export interface MapPosition {
  zoom: number;
  center: Coordinate;
}

// WMS request parameters. At least a LAYERS param is required.
export interface CrgWmsParams {
  LAYERS: string;
  FORMAT?: string;
  STYLES?: string;
  CQL_FILTER?: string;
  featureId?: string;
  featureIdsNegative?: string;
}

export interface CrgAdditionalLayerInfo {
  isUserLayer: boolean;
}

export interface LayerAdditionalProps {
  crgInfo: CrgAdditionalLayerInfo;
}
