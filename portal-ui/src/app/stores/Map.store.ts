import { action, computed, observable } from 'mobx';

import { MeasureItem, MeasureMode } from '../services/map/map-measure.service';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';

export enum MapModes {
  DEFAULT,
  SELECTION,
  MEASURE,
  DRAW,
  PICK
}

export enum MapActions {
  MOVE,
  PROKOL,
  SELECT_WITH_MODIFICATORS,
  SELECT,
  MEASUREMENT,
  DRAW,
  PICK
}

const actionsInModes = {
  [MapModes.DEFAULT]: [MapActions.MOVE, MapActions.PROKOL, MapActions.SELECT_WITH_MODIFICATORS],
  [MapModes.SELECTION]: [MapActions.MOVE, MapActions.PROKOL, MapActions.SELECT, MapActions.SELECT_WITH_MODIFICATORS],
  [MapModes.MEASURE]: [MapActions.MOVE, MapActions.MEASUREMENT],
  [MapModes.DRAW]: [MapActions.MOVE, MapActions.DRAW],
  [MapModes.PICK]: [MapActions.MOVE, MapActions.PICK]
};

class MapStore {
  private static _instance: MapStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  measureItems: MeasureItem[] = observable.array([], { deep: false });
  @observable measureMode?: MeasureMode;
  @observable mode: MapModes = MapModes.DEFAULT;
  @observable selectionActive = false;
  @observable unitsOfAreaMeasurement: UnitsOfAreaMeasurement = UnitsOfAreaMeasurement.HECTARE;

  private constructor() {}

  @computed
  get allowedActions(): MapActions[] {
    return actionsInModes[this.mode];
  }

  @action
  setMeasureMode(measureMode: MeasureMode) {
    this.measureMode = measureMode;
  }

  @action
  setMode(mode: MapModes) {
    this.mode = mode;
  }

  @action
  isSelectionActive(status: boolean) {
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
}

export const mapStore = MapStore.instance;
