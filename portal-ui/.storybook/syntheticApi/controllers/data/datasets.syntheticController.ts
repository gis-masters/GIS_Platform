import { type InternalAxiosRequestConfig } from 'axios';

import {
  DataEntityType,
  type Dataset,
  type NewDataset
} from '../../../../src/app/services/data/vectorData/vectorData.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { datasets } from '../../data/datasets';
import { err404, parseBody, parsePageOptions, toPageable } from '../../utils';
import { type SyntheticController } from '../masterController';

class DatasetsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/datasets$/;

  get(config: InternalAxiosRequestConfig): PageableResources<Dataset> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    if (pageOptions.sort === 'created_at') {
      pageOptions.sort = 'createdAt';
    }

    return toPageable(datasets, pageOptions);
  }

  post(config: InternalAxiosRequestConfig): Dataset {
    const data = parseBody<NewDataset>(config.data);
    const id = Math.max(0, ...datasets.map(({ id }) => id)) + 1;
    const dataset: Dataset = {
      id,
      title: data.title,
      details: data.details,
      identifier: `dataset_${id}`,
      type: DataEntityType.DATASET,
      createdAt: new Date().toISOString(),
      itemsCount: 0,
      role: Role.OWNER
    };

    datasets.push(dataset);

    return dataset;
  }
}

export const datasetsSyntheticController = new DatasetsSyntheticController();
