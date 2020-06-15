import { observable, action } from 'mobx';

import { CrgBaseMap } from '../services/crg/base-maps.models';

class BaseMaps {
  @observable baseMaps: CrgBaseMap[];
  @observable currentBaseMap?: CrgBaseMap;

  private static _instance: BaseMaps;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() { }

  @action
  initBaseMaps(baseMaps: CrgBaseMap[]) {
    this.baseMaps = baseMaps;
    this.currentBaseMap = baseMaps[0];
  }

  @action
  selectBaseMap(newId: number) {
    this.currentBaseMap = this.baseMaps.find(({ id }) => id === newId);
  }
}

export const baseMapsStore = BaseMaps.instance;
