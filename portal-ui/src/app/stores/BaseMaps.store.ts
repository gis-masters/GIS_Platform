import {action, computed, observable} from 'mobx';

import {CrgBaseMap, SourceType} from '../services/crg/base-maps.models';

class BaseMaps {
  private static _instance: BaseMaps;

  @observable _baseMaps: CrgBaseMap[];
  @observable _currentBaseMap: CrgBaseMap;

  private constructor() {
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  @action
  initBaseMaps(baseMaps: CrgBaseMap[]) {
    this._baseMaps = baseMaps;
    this._baseMaps.sort((a, b) => a.position - b.position);

    if (baseMaps.length) {
      this._currentBaseMap = this._baseMaps[0];
    }
  }

  @action
  setBaseMap(baseMap: CrgBaseMap) {
    this._currentBaseMap = baseMap;
  }

  @computed
  get getCurrentBaseMap(): CrgBaseMap | undefined {
    return this._currentBaseMap ? this._currentBaseMap : undefined;
  }

  baseMaps(): CrgBaseMap[] {
    return this._baseMaps;
  }

}

export const baseMapsStore = BaseMaps.instance;
