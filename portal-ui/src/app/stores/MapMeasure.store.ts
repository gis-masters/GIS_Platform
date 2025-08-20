import { action, makeObservable, observable } from 'mobx';

import { MeasureItem } from '../services/map/measure/map-measure.models';
import { UnitsOfAreaMeasurement } from '../services/util/open-layers.util';

class MapMeasureStore {
  private static _instance: MapMeasureStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable measureItems: MeasureItem[] = observable.array([], { deep: false });
  @observable unitsOfAreaMeasurement: UnitsOfAreaMeasurement = UnitsOfAreaMeasurement.HECTARE;

  private constructor() {
    makeObservable(this);
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

export const mapMeasureStore = MapMeasureStore.instance;
