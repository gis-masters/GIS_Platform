import { debounce } from 'lodash';

import { allDataEntitiesStore } from '../stores/AllDataEntitiesStore';
import { DataTable, getAllDatasets, getAllDatasetTables } from './data.service';
import { communicationService } from './communication.service';
import { Toast } from '../components/Toast/Toast';

class AllDataEntitiesService {
  private static _instance: AllDataEntitiesService;

  private allDataEntitiesStoreInited = false;
  private fetchingOperationId: Symbol;
  private debouncedFetchAllDataEntitiesStore: () => Promise<void>;

  private constructor() {
    this.debouncedFetchAllDataEntitiesStore = debounce(this.fetchAllDataEntitiesStore, 300);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async initAllDataEntitiesStore() {
    if (this.allDataEntitiesStoreInited) {
      return;
    }

    this.allDataEntitiesStoreInited = true;

    await this.fetchAllDataEntitiesStore();

    communicationService.datasetsUpdated.on(() => {
      this.debouncedFetchAllDataEntitiesStore();
    }, this);
  }

  dropAllDataEntitiesStore() {
    communicationService.off(this);
    this.allDataEntitiesStoreInited = false;
  }

  private async fetchAllDataEntitiesStore() {
    if (!this.allDataEntitiesStoreInited) {
      return;
    }

    const operationId = Symbol();
    this.fetchingOperationId = operationId;

    const datasets = await getAllDatasets();
    let dataTables: DataTable[] = [];

    for (const dataset of datasets) {
      try {
        dataTables = dataTables.concat(await getAllDatasetTables(dataset));
      } catch (e) {
        Toast.error({
          message: `Ошибка получения таблиц в наборе "${dataset.title}" (${dataset.identifier})`,
          canBeSuppressed: true
        });
      }
      if (this.fetchingOperationId !== operationId) {
        return;
      }
    }

    allDataEntitiesStore.setDatasets(datasets);
    allDataEntitiesStore.setDataTables(dataTables);
  }
}

export const allDataEntitiesService = AllDataEntitiesService.instance;
