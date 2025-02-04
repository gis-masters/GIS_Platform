import { action, makeObservable, observable } from 'mobx';
import { Feature } from 'ol';

import { LabelType } from '../services/map/labels/map-labels.models';

class MapLabelsStore {
  private static _instance: MapLabelsStore;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable labelsVisible = false;
  @observable currentLabelType?: LabelType;

  labels: Feature[] = observable.array([], { deep: false });

  private constructor() {
    makeObservable(this);
  }

  @action
  setLabelsVisibility(status: boolean) {
    this.labelsVisible = status;
  }

  @action
  setCurrentLabelType(type?: LabelType) {
    this.currentLabelType = type;
  }

  @action
  setLabels(labels: Feature[]) {
    this.labels.splice(0, this.labels.length, ...labels);
  }
}

export const mapLabelsStore = MapLabelsStore.instance;
