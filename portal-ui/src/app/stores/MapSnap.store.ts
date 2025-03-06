import { action, makeObservable, observable } from 'mobx';

import { MapMode } from '../services/map/map.models';
import { mapStore } from './Map.store';

class MapSnapStore {
  private static _instance: MapSnapStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable pixelTolerance: number = 10;

  private constructor() {
    makeObservable(this);
  }

  @action
  setPixelTolerance(value: number) {
    this.pixelTolerance = value;
  }

  @observable
  isSnapActive(): boolean {
    return mapStore.mode === MapMode.VERTICES_MODIFICATION || mapStore.mode === MapMode.DRAW_FEATURE;
  }

  @observable
  isSnapNotActive(): boolean {
    return !this.isSnapActive();
  }
}

export const mapSnapStore = MapSnapStore.instance;
