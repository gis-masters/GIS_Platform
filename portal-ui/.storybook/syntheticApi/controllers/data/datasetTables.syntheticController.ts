import { type InternalAxiosRequestConfig } from 'axios';

import {
  DataEntityType,
  type NewVectorTable,
  type RawVectorTable
} from '../../../../src/app/services/data/vectorData/vectorData.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { datasets } from '../../data/datasets';
import { schemas } from '../../data/schemas';
import { vectorTables } from '../../data/vectorTables';
import { err404, parseBody, parsePageOptions, toPageable } from '../../utils';
import { type SyntheticController } from '../masterController';

class DatasetTablesSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/datasets\/([^/?#]+)\/tables$/;

  get(config: InternalAxiosRequestConfig): PageableResources<RawVectorTable> {
    const datasetIdentifier = config.url?.match(this.pattern)?.at(1);
    const tables = vectorTables.filter(({ dataset }) => dataset === datasetIdentifier);

    return toPageable(tables, parsePageOptions(config));
  }

  post(config: InternalAxiosRequestConfig): RawVectorTable {
    const datasetIdentifier = config.url?.match(this.pattern)?.at(1);
    const dataset = datasets.find(item => item.identifier === datasetIdentifier);

    if (!dataset || !datasetIdentifier) {
      throw err404(config);
    }

    const data = parseBody<NewVectorTable>(config.data);
    const schema = schemas.find(({ name }) => name === data.schemaId) ?? schemas[0];

    if (!schema) {
      throw err404(config);
    }
    const id = Math.max(0, ...vectorTables.map(table => table.id)) + 1;
    const table: RawVectorTable = {
      id,
      title: data.title,
      identifier: `table_${id}`,
      type: DataEntityType.TABLE,
      createdAt: new Date().toISOString(),
      role: Role.OWNER,
      crs: data.crs,
      schema,
      dataset: datasetIdentifier,
      itemsCount: 0
    };

    vectorTables.push(table);
    dataset.itemsCount = (dataset.itemsCount || 0) + 1;

    return table;
  }
}

export const datasetTablesSyntheticController = new DatasetTablesSyntheticController();
