import { action, makeObservable, observable } from 'mobx';

import { MapMode, ToolMode } from '../services/map/map.models';
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
  isSnapToolActive(): boolean {
    return mapStore.mode === MapMode.VERTICES_MODIFICATION || mapStore.toolMode === ToolMode.DRAW;
  }
}

export const mapSnapStore = MapSnapStore.instance;
