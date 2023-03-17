import { debounce } from 'lodash';

import { allDataEntitiesStore } from '../../../stores/AllDataEntities.store';
import { communicationService } from '../../communication.service';
import { Toast } from '../../../components/Toast/Toast';

import { getAllVectorTablesInDataset } from './vectorData.service';
import { _reqGetAllDatasets } from './vectorData.client';
import { VectorTable } from './vectorData.models';

class AllDataEntitiesService {
  private static _instance: AllDataEntitiesService;

  private allDataEntitiesStoreInited = false;
  private fetchingOperationId: symbol;
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

    const datasets = await _reqGetAllDatasets();
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
