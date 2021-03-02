import { observable, action } from 'mobx';

import { Basemap, SourceType } from '../services/crg/basemaps.models';

const osmBasemap = { title: 'OSM', thumbnailUrn: '/assets/images/thumbnail-osm.jpg', type: SourceType.OSM, id: 666 };

class Basemaps {
  @observable basemaps: Basemap[];
  @observable currentBasemap: Basemap;

  private static _instance: Basemaps;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    this.initBaseMaps([osmBasemap]);
  }

  @action
  initBaseMaps(basemaps: Basemap[]) {
    if (basemaps.length) {
      this.basemaps = basemaps;
      this.currentBasemap = basemaps[0];
    }
  }

  @action
  selectBasemap(newId: number) {
    this.currentBasemap = this.basemaps.find(({ id }) => id === newId);
  }
}

export const basemapsStore = Basemaps.instance;
