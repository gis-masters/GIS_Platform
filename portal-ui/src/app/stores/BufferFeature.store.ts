import { action, makeObservable, observable } from 'mobx';

import { Projection } from '../services/data/projections/projections.models';
import { WfsFeature } from '../services/geoserver/wfs/wfs.models';

class BufferFeatureStore {
  @observable bufferFeature: WfsFeature | null;
  @observable prevProjection?: Projection;

  private static _instance: BufferFeatureStore;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  constructor() {
    makeObservable(this);

    this.bufferFeature = null;
  }

  @action
  setPrevProjection(prevProjection?: Projection): void {
    this.prevProjection = prevProjection;
  }

  @action
  setBufferFeature(bufferFeature: WfsFeature): void {
    this.bufferFeature = bufferFeature;
  }

  @action
  clearBufferFeature(): void {
    this.bufferFeature = null;
  }
}

export const bufferFeatureStore = BufferFeatureStore.instance;
