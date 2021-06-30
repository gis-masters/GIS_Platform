import { action, observable } from 'mobx';

import { MeasureItem, MeasureMode } from '../services/map/map-measure.service';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';

class MapStore {
  private static _instance: MapStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  measureItems: MeasureItem[] = observable.array([], { deep: false });
  @observable measureMode: MeasureMode | null;
  @observable unitsOfAreaMeasurement: UnitsOfAreaMeasurement = UnitsOfAreaMeasurement.HECTARE;

  private constructor() {}

  @action
  setMeasureMode(measureMode: MeasureMode | null) {
    this.measureMode = measureMode;
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
