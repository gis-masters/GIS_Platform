import { action, computed, observable, reaction, makeObservable } from 'mobx';
import Filter from 'ol/format/filter/Filter';
import sift from 'sift';

import { route, Pages } from './Route.store';
import { MeasureItem, MeasureMode } from '../services/map/map-measure.service';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';
import { CrgLayer, CrgVectorLayer } from '../services/gis/projects.models';
import { WfsFeature } from '../services/geoserver/wfs.models';
import { FilterQuery, prepareLike } from '../services/util/filterObjects';
import { buildCqlFilter } from '../services/util/cql';
import { cql2ol } from '../services/util/cql2ol';
import { flags } from '../services/feature-flags';

export enum MapSelectionTypes {
  ADD,
  REMOVE,
  REPLACE
}

export enum MapMode {
  DEFAULT,
  SELECTION,
  MEASURE,
  DRAW,
  PICK
}

export enum MapAction {
  MOVE,
  PROKOL,
  SELECT_WITH_MODIFICATORS,
  SELECT,
  MEASUREMENT,
  DRAW,
  PICK
}

export enum FilterBySelection {
  ONLY_SELECTED = 'selected',
  ONLY_NOT_SELECTED = 'notSelected',
  DISABLED = 'disabled'
}

const actionsInModes = {
  [MapMode.DEFAULT]: [MapAction.MOVE, MapAction.PROKOL, MapAction.SELECT_WITH_MODIFICATORS],
  [MapMode.SELECTION]: [MapAction.MOVE, MapAction.PROKOL, MapAction.SELECT, MapAction.SELECT_WITH_MODIFICATORS],
  [MapMode.MEASURE]: [MapAction.MOVE, MapAction.MEASUREMENT],
  [MapMode.DRAW]: [MapAction.MOVE, MapAction.DRAW],
  [MapMode.PICK]: [MapAction.MOVE, MapAction.PICK]
};

const defaultValues: Partial<MapStore> = {
  selectionActive: false,
  mode: MapMode.DEFAULT,
  unitsOfAreaMeasurement: UnitsOfAreaMeasurement.HECTARE,
  selectedFeatures: []
};

class MapStore {
  @observable private loadingCount = 0;
  @observable attributeTableFilter: { [tableName: string]: FilterQuery } = {};
  measureItems: MeasureItem[] = observable.array([], { deep: false });
  @observable measureMode?: MeasureMode;
  @observable mode: MapMode;
  @observable selectionActive: boolean;
  @observable unitsOfAreaMeasurement: UnitsOfAreaMeasurement;
  @observable selectedFeatures?: WfsFeature[];

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
      const [tableName] = feature.id.split('.');
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
  get attributeTableOlFilter(): { [tableName: string]: Filter } {
    return Object.fromEntries(
      Object.entries(this.attributeTableFilter).map(([tableName, filterQuery]) => [
        tableName,
        cql2ol(buildCqlFilter(filterQuery))
      ])
    );
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
      const [tableName] = feature.id.split('.');

      if (!filtersByLayers[tableName]) {
        const { filterBySelection, ...attributeTableFilter } = mapStore.attributeTableFilter[tableName] || {};
        filtersByLayers[tableName] = {
          tester: Object.keys(attributeTableFilter).length ? sift(prepareLike(attributeTableFilter)) : undefined,
          negativeIds: filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
        };
      }

      const { negativeIds, tester } = filtersByLayers[tableName];

      return !negativeIds && (!tester || tester(feature.properties));
    });
  }

  isFiltered(layer: CrgLayer) {
    return !!this.attributeTableFilter[layer.tableName];
  }

  @action
  updateAttributeTableFilter(layer: CrgVectorLayer, filter?: FilterQuery) {
    if (filter) {
      this.attributeTableFilter[layer.tableName] = filter;
    } else {
      delete this.attributeTableFilter[layer.tableName];
    }
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
  setMeasureMode(measureMode: MeasureMode) {
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

  @action
  setSelectedFeatures(features: WfsFeature[]) {
    this.selectedFeatures = features;
  }

  @action
  dropSelectedFeatures() {
    this.selectedFeatures = [];
  }

  @action
  private reset() {
    Object.assign(this, defaultValues);
  }
}

export const mapStore = MapStore.instance;
