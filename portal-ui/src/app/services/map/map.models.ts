import { Coordinate } from 'ol/coordinate';

export enum FeatureState {
  EMPTY = 'emptyFeature',
  ACTIVE = 'activeFeature',
  SELECTED = 'selectedFeature'
}

export type CursorType =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'grab'
  | 'grabbing'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum ToolMode {
  NONE,
  DRAW,
  MEASURE_LENGTH,
  MEASURE_AREA,
  SELECTION,
  ADDING_LABEL
}

export enum MapMode {
  NONE,
  DRAW_FEATURE,
  EDIT_FEATURE,
  SELECTED_FEATURES,
  SEARCH_IN_PROJECT,
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
  MAP_TOOL_MEASURE_AREA,
  MAP_TOOL_MEASURE_LENGTH,
  LAYER_SIDEBAR_LEFT_TOOLS,
  SELECT_WITH_MODIFICATORS,
  REMOVE_FEATURE_FROM_SELECTED
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
