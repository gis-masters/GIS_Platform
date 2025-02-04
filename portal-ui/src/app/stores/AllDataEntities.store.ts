import { action, makeObservable, observable } from 'mobx';

import { Dataset, VectorTable } from '../services/data/vectorData/vectorData.models';

class AllDataEntities {
  private static _instance: AllDataEntities;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable vectorTables: VectorTable[] = [];
  @observable datasets: Dataset[] = [];

  private constructor() {
    makeObservable(this);
  }

  @action setVectorTables(list: VectorTable[]) {
    this.vectorTables = list;
  }

  @action setDatasets(list: Dataset[]) {
    this.datasets = list;
  }
}

export const allDataEntitiesStore = AllDataEntities.instance;
