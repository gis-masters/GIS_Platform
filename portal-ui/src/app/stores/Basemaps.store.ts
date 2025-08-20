import { action, makeObservable, observable } from 'mobx';

import { Basemap, SourceType } from '../services/data/basemaps/basemaps.models';

const osmBasemap = { title: 'OSM', thumbnailUrn: '/assets/images/thumbnail-osm.jpg', type: SourceType.OSM, id: 666 };

class Basemaps {
  private static _instance: Basemaps;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable basemaps: Basemap[] = [];
  @observable currentBasemap?: Basemap;

  private constructor() {
    makeObservable(this);
    this.initBasemaps([osmBasemap]);
  }

  @action
  initBasemaps(basemaps: Basemap[]) {
    if (basemaps.length) {
      this.basemaps = basemaps;
      this.currentBasemap = basemaps[0];
    }
  }

  @action
  clear() {
    this.initBasemaps([osmBasemap]);
  }

  @action
  selectBasemap(newId: number) {
    this.currentBasemap = this.basemaps.find(({ id }) => id === newId);
  }
}

export const basemapsStore = Basemaps.instance;
