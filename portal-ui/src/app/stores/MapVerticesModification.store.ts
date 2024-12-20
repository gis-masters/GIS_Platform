import { action, makeObservable, observable } from 'mobx';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';

class MapVerticesModificationStore {
  private static _instance: MapVerticesModificationStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable saving: boolean = false;
  @observable modifiedFeatures: Feature<Geometry>[] = [];

  private constructor() {
    makeObservable(this);
  }

  @action
  updateModifiedCollection(modFeatures: Array<Feature>) {
    if (modFeatures === undefined || modFeatures.length < 1) {
      this.modifiedFeatures = [];

      return;
    }

    for (const newFeature of modFeatures) {
      const existingFeatureIndex = this.modifiedFeatures.findIndex(f => f.getId() === newFeature.getId());
      if (existingFeatureIndex === -1) {
        this.modifiedFeatures.push(newFeature);
      } else {
        this.modifiedFeatures[existingFeatureIndex] = newFeature;
      }
    }
  }

  @action
  saveOn() {
    this.saving = true;
  }

  @action
  saveOff() {
    this.saving = false;
  }
}

export const mapVerticesModificationStore = MapVerticesModificationStore.instance;
