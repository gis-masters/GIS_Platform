import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { Feature } from 'ol';
import sift from 'sift';

import { extractFeatureIdsFromAttributesFilter } from '../components/Attributes/Attributes.utils';
import { flags } from '../services/feature-flags';
import { extractTableNameFromFeatureId } from '../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { CrgLayer } from '../services/gis/layers/layers.models';
import { MapAction, MapMode, MeasureMode } from '../services/map/map.models';
import { LabelType } from '../services/map/map-labels.models';
import { MeasureItem } from '../services/map/map-measure.service';
import { prepareLike } from '../services/util/filters/filterObjects';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';
import { attributesTableStore } from './AttributesTable.store';
import { currentProject } from './CurrentProject.store';
import { Pages, route } from './Route.store';

const mapModeAndActionMatrix = {
  [MapMode.DEFAULT]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.MAP_MEASURE,
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
    MapAction.SELECT_WITH_MODIFICATORS
  ],
  [MapMode.SELECTION]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.MAP_MEASURE,
    MapAction.SEARCH_FIELD,
    MapAction.MAP_SELECTION,
    MapAction.PRINT_MAP_PDF,
    MapAction.ATTRIBUTES_TAB,
    MapAction.ZOOM_TO_FEATURE,
    MapAction.SELECT_BY_BORDER,
    MapAction.LAYER_FILTRATION,
    MapAction.OPEN_EDIT_FEATURE,
    MapAction.OPEN_LAYER_SOURCE,
    MapAction.OPEN_ATTRIBUTE_TABLE,
    MapAction.OPEN_IMPORTS_SUBMENU,
    MapAction.OPEN_LAYER_PROPERTIES,
    MapAction.VERTICES_MODIFICATION,
    MapAction.SELECT_WITH_MODIFICATORS
  ],
  [MapMode.MEASURE]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.MAP_MEASURE,
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
    MapAction.SELECT_WITH_MODIFICATORS
  ],
  [MapMode.DRAW]: [MapAction.DRAW],
  [MapMode.ADDING_LABEL]: [
    MapAction.PROKOL,
    MapAction.LAYER_EYE,
    MapAction.ADD_LAYER,
    MapAction.CHECK_BUGS,
    MapAction.EXPORT_GML,
    MapAction.EXPORT_SHP,
    MapAction.MAP_LABELS,
    MapAction.ADD_FEATURE,
    MapAction.MAP_MEASURE,
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
    MapAction.SELECT_WITH_MODIFICATORS
  ],
  [MapMode.VERTICES_MODIFICATION]: [MapAction.VERTICES_MODIFICATION]
};

const defaultValues: Partial<MapStore> = {
  selectionActive: false,
  mode: MapMode.DEFAULT,
  unitsOfAreaMeasurement: UnitsOfAreaMeasurement.HECTARE,
  selectedFeatures: [],
  labelsVisible: false,
  labels: observable.array([], { deep: false })
};

class MapStore {
  @observable private loadingCount = 0;

  measureItems: MeasureItem[] = observable.array([], { deep: false });
  @observable measureMode: MeasureMode | null = null;
  @observable unitsOfAreaMeasurement: UnitsOfAreaMeasurement = UnitsOfAreaMeasurement.HECTARE;

  @observable mode: MapMode = MapMode.DEFAULT;

  @observable selectionActive: boolean = false;
  @observable selectedFeatures: WfsFeature[] = [];

  @observable labelsVisible = false;
  @observable currentLabelType?: LabelType;
  labels: Feature[] = observable.array([], { deep: false });

  private _selectingFeaturesLimit = 500;

  private static _instance: MapStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

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

  get selectingFeaturesLimit(): number {
    return flags.selectingFeaturesLimit ? Number(flags.selectingFeaturesLimit) : this._selectingFeaturesLimit;
  }

  // TODO: переделать на mapStore.allowedActions.includes({some_action})
  isProkolAllowed() {
    if (this.mode === MapMode.DEFAULT || this.mode === MapMode.SELECTION) {
      return true;
    }
  }

  getFeatureInSelectionById(id: string): WfsFeature | undefined {
    return this.selectedFeatures.find(feature => feature.id === id);
  }

  @computed
  get selectedFeaturesByTableName(): Record<string, WfsFeature[]> {
    const result: Record<string, WfsFeature[]> = {};

    for (const feature of this.selectedFeatures) {
      const tableName = extractTableNameFromFeatureId(feature.id);
      if (!result[tableName]) {
        result[tableName] = [];
      }
      result[tableName].push(feature);
    }

    return result;
  }

  @computed
  get allowedActions(): MapAction[] {
    return mapModeAndActionMatrix[this.mode];
  }

  @computed
  get isLoading(): boolean {
    return Boolean(this.loadingCount);
  }

  @computed
  get highlightedFeatures(): WfsFeature[] {
    const filtersByLayers: {
      [tableName: string]: {
        tester?: (properties: WfsFeature['properties']) => boolean;
        ids: string[];
        negativeIds: boolean;
      };
    } = {};

    return this.selectedFeatures.filter(feature => {
      const tableName = extractTableNameFromFeatureId(feature.id);

      if (!filtersByLayers[tableName]) {
        const layer = currentProject.getLayerByTableNameFromAllVectorableLayers(tableName);

        filtersByLayers[tableName] = this.prepareLayerFilter(layer);
      }

      const { negativeIds, ids, tester } = filtersByLayers[tableName];

      return !negativeIds && (!tester || tester(feature.properties)) && (!ids.length || ids.includes(feature.id));
    });
  }

  @computed
  get limitReached(): boolean {
    return this.selectedFeatures.length >= this.selectingFeaturesLimit;
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
  setMeasureMode(measureMode: MeasureMode | null) {
    this.measureMode = measureMode;
  }

  @action
  setMode(mode: MapMode) {
    this.mode = mode;
  }

  @action
  setSelectionActive(status: boolean) {
    this.selectionActive = status;
  }

  @action
  setUnitsOfAreaMeasurement(units: UnitsOfAreaMeasurement) {
    this.unitsOfAreaMeasurement = units;
    localStorage.setItem('UnitsOfAreaMeasurement', units);
  }

  @action
  addMeasureItem(item: MeasureItem) {
    this.measureItems.push(item);
  }
  @action
  removeMeasureItem(item: MeasureItem) {
    const itemIndex = this.measureItems.findIndex(({ id }) => id === item.id);

    if (itemIndex !== -1) {
      this.measureItems.splice(itemIndex, 1);
    }
  }

  // use only in map-selection.service.ts

  @action
  setSelectedFeatures(features: WfsFeature[]) {
    this.selectedFeatures = features;
  }

  @action
  setLabelsVisibility(status: boolean) {
    this.labelsVisible = status;
  }

  @action
  setCurrentLabelType(type?: LabelType) {
    this.currentLabelType = type;
  }

  @action
  setLabels(labels: Feature[]) {
    this.labels.splice(0, this.labels.length, ...labels);
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }

  private prepareLayerFilter(layer: CrgLayer) {
    if (!layer.tableName) {
      throw new Error(`Слой ${layer.title} не имеет tableName`);
    }

    const [ids, filter, negativeIds] = extractFeatureIdsFromAttributesFilter(
      attributesTableStore.getLayerFilter(layer.tableName, true),
      layer
    );

    return {
      tester: Object.keys(filter).length ? sift(prepareLike(filter)) : undefined,
      ids,
      negativeIds
    };
  }
}

export const mapStore = MapStore.instance;
