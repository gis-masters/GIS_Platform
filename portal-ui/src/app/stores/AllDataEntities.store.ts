import { observable, action, makeObservable } from 'mobx';

import { Dataset, VectorTable } from '../services/data/data.service';

class AllDataEntities {
  @observable vectorTables: VectorTable[] = [];
  @observable datasets: Dataset[] = [];

  private static _instance: AllDataEntities;

  private constructor() {
    makeObservable(this);
  }

  @action setVectorTables(list: VectorTable[]) {
    this.vectorTables = list;
  }

  @action setDatasets(list: Dataset[]) {
    this.datasets = list;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allDataEntitiesStore = AllDataEntities.instance;
