import { observable, action } from 'mobx';

import { CrgBaseMap, SourceType } from '../services/crg/base-maps.models';

const osmBaseMap = { title: 'OSM', thumbnailUrn: '/assets/images/thumbnail-osm.jpg', type: SourceType.OSM, id: 666 };

class BaseMaps {
  @observable baseMaps: CrgBaseMap[];
  @observable currentBaseMap: CrgBaseMap;

  private static _instance: BaseMaps;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.initBaseMaps([osmBaseMap]);
  }

  @action
  initBaseMaps(baseMaps: CrgBaseMap[]) {
    if (baseMaps.length) {
      this.baseMaps = baseMaps;
      this.currentBaseMap = baseMaps[0];
    }
  }

  @action
  selectBaseMap(newId: number) {
    this.currentBaseMap = this.baseMaps.find(({ id }) => id === newId);
  }
}

export const baseMapsStore = BaseMaps.instance;
