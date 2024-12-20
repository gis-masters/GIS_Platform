import { debounce, DebouncedFunc } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { allDataEntitiesStore } from '../../../stores/AllDataEntities.store';
import { communicationService } from '../../communication.service';
import { vectorDataClient } from './vectorData.client';
import { VectorTable } from './vectorData.models';
import { getAllVectorTablesInDataset } from './vectorData.service';

class AllDataEntitiesService {
  private static _instance: AllDataEntitiesService;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private allDataEntitiesStoreInited = false;
  private fetchingOperationId?: symbol;
  readonly debouncedFetchAllDataEntitiesStore: DebouncedFunc<() => Promise<void>>;

  private constructor() {
    this.debouncedFetchAllDataEntitiesStore = debounce(this.fetchAllDataEntitiesStore, 300);
  }

  async initAllDataEntitiesStore() {
    if (this.allDataEntitiesStoreInited) {
      return;
    }

    this.allDataEntitiesStoreInited = true;

    await this.fetchAllDataEntitiesStore();

    communicationService.datasetUpdated.on(() => {
      void this.debouncedFetchAllDataEntitiesStore();
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

    const datasets = await vectorDataClient.getAllDatasets();
    let vectorTables: VectorTable[] = [];

    for (const dataset of datasets) {
      try {
        vectorTables = [...vectorTables, ...(await getAllVectorTablesInDataset(dataset))];
      } catch {
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
    allDataEntitiesStore.setVectorTables(vectorTables);
  }
}

export const allDataEntitiesService = AllDataEntitiesService.instance;
