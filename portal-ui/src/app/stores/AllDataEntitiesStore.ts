import { observable, action } from 'mobx';

import { Dataset, DataTable } from '../services/data.service';

class AllDataEntities {
  @observable dataTables: DataTable[] = [];
  @observable datasets: Dataset[] = [];

  private static _instance: AllDataEntities;

  private constructor() {}

  @action setDataTables(list: DataTable[]) {
    this.dataTables = list;
  }

  @action setDatasets(list: Dataset[]) {
    this.datasets = list;
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const allDataEntitiesStore = AllDataEntities.instance;
