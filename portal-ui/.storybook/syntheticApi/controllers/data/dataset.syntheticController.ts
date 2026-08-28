import { type InternalAxiosRequestConfig } from 'axios';

import { type Dataset } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { datasets } from '../../data/datasets';
import { err404 } from '../../utils';
import { type SyntheticController } from '../masterController';

class DatasetSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/datasets\/([^/?#]+)$/;

  get(config: InternalAxiosRequestConfig): Dataset {
    const identifier = config.url?.match(this.pattern)?.at(1);
    const dataset = datasets.find(item => item.identifier === identifier);

    if (!dataset) {
      throw err404(config);
    }

    return dataset;
  }
}

export const datasetSyntheticController = new DatasetSyntheticController();
