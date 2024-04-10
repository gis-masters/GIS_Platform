import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { cloneDeep } from 'lodash';
import { Feature } from 'ol';
import sift from 'sift';

import { route, Pages } from './Route.store';
import { attributesTableStore } from './AttributesTable.store';
import { getFieldFilterValue, modifyFieldFilterValue, prepareLike } from '../services/util/filterObjects';
import { FilterBySelection, LabelType, MapAction, MapMode } from '../services/map/map.models';
import { MeasureItem, MeasureMode } from '../services/map/map-measure.service';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';
import { WfsFeature } from '../services/geoserver/wfs/wfs.models';
import { flags } from '../services/feature-flags';
import { FILTER_BY_SELECTION } from '../components/Attributes/Table/Attributes-Table';
import { extractTableNameFromFeatureId } from '../services/geoserver/feature.util';

const actionsInModes = {
  [MapMode.DEFAULT]: [MapAction.MOVE, MapAction.PROKOL, MapAction.SELECT_WITH_MODIFICATORS],
  [MapMode.SELECTION]: [MapAction.MOVE, MapAction.PROKOL, MapAction.SELECT, MapAction.SELECT_WITH_MODIFICATORS],
  [MapMode.MEASURE]: [MapAction.MOVE, MapAction.MEASUREMENT],
  [MapMode.DRAW]: [MapAction.MOVE, MapAction.DRAW],
  [MapMode.PICK]: [MapAction.MOVE, MapAction.PICK],
  [MapMode.ADDING_LABEL]: [MapAction.MOVE, MapAction.ADD_LABEL]
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
    return actionsInModes[this.mode];
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
        negativeIds: boolean;
      };
    } = {};

    return this.selectedFeatures.filter(feature => {
      const tableName = extractTableNameFromFeatureId(feature.id);
      if (!filtersByLayers[tableName]) {
        const filter = cloneDeep(attributesTableStore.getLayerFilter(tableName, true));
        const filterBySelection = getFieldFilterValue(filter, FILTER_BY_SELECTION);
        modifyFieldFilterValue(filter, FILTER_BY_SELECTION);

        filtersByLayers[tableName] = {
          tester: Object.keys(filter).length ? sift(prepareLike(filter)) : undefined,
          negativeIds: filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
        };
      }

      const { negativeIds, tester } = filtersByLayers[tableName];

      return !negativeIds && (!tester || tester(feature.properties));
    });
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

  @computed
  get limitReached(): boolean {
    return this.selectedFeatures.length >= this.selectingFeaturesLimit;
  }
}

export const mapStore = MapStore.instance;
