import { action, computed, makeObservable, observable, reaction } from 'mobx';

import { MapAction, MapMode, ToolMode } from '../services/map/map.models';
import { Pages, route } from './Route.store';

// TODO: Матрица прав "разрешающая", т.е. разрешено только то, что указано... может удобнее сделать наоборот?
const mapModeAndActionMatrix = {
  [MapMode.NONE]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.SEARCH_FIELD,
    MapAction.DELETE_LAYER,
    MapAction.DELETE_GROUP,
    MapAction.MAP_SELECTION,
    MapAction.PRINT_MAP_PDF,
    MapAction.ATTRIBUTES_TAB,
    MapAction.ZOOM_TO_FEATURE,
    MapAction.LAYER_FILTRATION,
    MapAction.SELECT_BY_BORDER,
    MapAction.OPEN_EDIT_FEATURE,
    MapAction.OPEN_LAYER_SOURCE,
    MapAction.RENAME_LAYER_GROUP,
    MapAction.CREATE_LAYER_GROUP,
    MapAction.EDIT_PROJECT_LAYER,
    MapAction.OPEN_ATTRIBUTE_TABLE,
    MapAction.OPEN_IMPORTS_SUBMENU,
    MapAction.OPEN_LAYER_PROPERTIES,
    MapAction.VERTICES_MODIFICATION,
    MapAction.MAP_TOOL_MEASURE_AREA,
    MapAction.MAP_TOOL_MEASURE_LENGTH,
    MapAction.LAYER_SIDEBAR_LEFT_TOOLS,
    MapAction.SELECT_WITH_MODIFICATORS,
    MapAction.REMOVE_FEATURE_FROM_SELECTED
  ],
  [MapMode.DRAW_FEATURE]: [MapAction.DRAW],
  [MapMode.EDIT_FEATURE]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.SEARCH_FIELD,
    MapAction.DELETE_LAYER,
    MapAction.DELETE_GROUP,
    MapAction.MAP_SELECTION,
    MapAction.PRINT_MAP_PDF,
    MapAction.ATTRIBUTES_TAB,
    MapAction.ZOOM_TO_FEATURE,
    MapAction.LAYER_FILTRATION,
    MapAction.OPEN_EDIT_FEATURE,
    MapAction.OPEN_LAYER_SOURCE,
    MapAction.RENAME_LAYER_GROUP,
    MapAction.CREATE_LAYER_GROUP,
    MapAction.EDIT_PROJECT_LAYER,
    MapAction.OPEN_ATTRIBUTE_TABLE,
    MapAction.OPEN_IMPORTS_SUBMENU,
    MapAction.OPEN_LAYER_PROPERTIES,
    MapAction.VERTICES_MODIFICATION,
    MapAction.MAP_TOOL_MEASURE_AREA,
    MapAction.MAP_TOOL_MEASURE_LENGTH,
    MapAction.SELECT_WITH_MODIFICATORS,
    MapAction.REMOVE_FEATURE_FROM_SELECTED
  ],
  [MapMode.SELECTED_FEATURES]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.SEARCH_FIELD,
    MapAction.DELETE_LAYER,
    MapAction.DELETE_GROUP,
    MapAction.MAP_SELECTION,
    MapAction.PRINT_MAP_PDF,
    MapAction.ATTRIBUTES_TAB,
    MapAction.ZOOM_TO_FEATURE,
    MapAction.LAYER_FILTRATION,
    MapAction.OPEN_EDIT_FEATURE,
    MapAction.OPEN_LAYER_SOURCE,
    MapAction.RENAME_LAYER_GROUP,
    MapAction.CREATE_LAYER_GROUP,
    MapAction.EDIT_PROJECT_LAYER,
    MapAction.OPEN_ATTRIBUTE_TABLE,
    MapAction.OPEN_IMPORTS_SUBMENU,
    MapAction.OPEN_LAYER_PROPERTIES,
    MapAction.VERTICES_MODIFICATION,
    MapAction.MAP_TOOL_MEASURE_AREA,
    MapAction.MAP_TOOL_MEASURE_LENGTH,
    MapAction.LAYER_SIDEBAR_LEFT_TOOLS,
    MapAction.SELECT_WITH_MODIFICATORS,
    MapAction.REMOVE_FEATURE_FROM_SELECTED
  ],
  [MapMode.SEARCH_IN_PROJECT]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.SEARCH_FIELD,
    MapAction.DELETE_LAYER,
    MapAction.DELETE_GROUP,
    MapAction.MAP_SELECTION,
    MapAction.PRINT_MAP_PDF,
    MapAction.ATTRIBUTES_TAB,
    MapAction.ZOOM_TO_FEATURE,
    MapAction.LAYER_FILTRATION,
    MapAction.OPEN_EDIT_FEATURE,
    MapAction.OPEN_LAYER_SOURCE,
    MapAction.RENAME_LAYER_GROUP,
    MapAction.CREATE_LAYER_GROUP,
    MapAction.EDIT_PROJECT_LAYER,
    MapAction.OPEN_ATTRIBUTE_TABLE,
    MapAction.OPEN_IMPORTS_SUBMENU,
    MapAction.OPEN_LAYER_PROPERTIES,
    MapAction.VERTICES_MODIFICATION,
    MapAction.MAP_TOOL_MEASURE_AREA,
    MapAction.MAP_TOOL_MEASURE_LENGTH,
    MapAction.SELECT_WITH_MODIFICATORS,
    MapAction.REMOVE_FEATURE_FROM_SELECTED
  ],
  [MapMode.VERTICES_MODIFICATION]: [MapAction.VERTICES_MODIFICATION]
};

const defaultValues: Partial<MapStore> = {
  mode: MapMode.NONE,
  toolMode: ToolMode.NONE
};

class MapStore {
  private static _instance: MapStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable mode: MapMode = MapMode.NONE;
  @observable toolMode: ToolMode = ToolMode.NONE;

  @observable private loadingCount = 0;

  private constructor() {
    makeObservable(this);

    this.reset();

    reaction(
      () => route.data && route.data.page,
      page => {
        if (page !== Pages.MAP) {
          this.reset();
        }
      }
    );
  }

  @computed
  get allowedActions(): MapAction[] {
    return mapModeAndActionMatrix[this.mode];
  }

  @computed
  get isLoading(): boolean {
    return Boolean(this.loadingCount);
  }

  @action
  enrollLoadingStart() {
    this.loadingCount++;
  }

  @action
  enrollLoadingFinish() {
    this.loadingCount--;
  }

  @action
  setMode(mode: MapMode) {
    this.mode = mode;
  }

  @action
  setToolMode(toolMode: ToolMode) {
    this.toolMode = toolMode;
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const mapStore = MapStore.instance;
