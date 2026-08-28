import { type InternalAxiosRequestConfig } from 'axios';

import { type RawVectorTable } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { vectorTables } from '../../data/vectorTables';
import { err404 } from '../../utils';
import { type SyntheticController } from '../masterController';

class DatasetTableSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/datasets\/([^/?#]+)\/tables\/([^/?#]+)$/;

  get(config: InternalAxiosRequestConfig): RawVectorTable {
    const match = config.url?.match(this.pattern);
    const datasetIdentifier = match?.at(1);
    const tableIdentifier = match?.at(2);
    const table = vectorTables.find(item => item.dataset === datasetIdentifier && item.identifier === tableIdentifier);

    if (!table) {
      throw err404(config);
    }

    return table;
  }
}

export const datasetTableSyntheticController = new DatasetTableSyntheticController();
