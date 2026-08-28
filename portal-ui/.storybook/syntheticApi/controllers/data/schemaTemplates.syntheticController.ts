import { type InternalAxiosRequestConfig } from 'axios';

import { type SchemaTemplateWithOldSchema } from '../../../../src/app/services/data/schemaTemplate/schemaTemplate.models';
import { getSchemaTemplates } from '../../data/schemaTemplates';
import { err404, getQueryParams } from '../../utils';
import { type SyntheticController } from '../masterController';

class SchemaTemplatesSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/schemasTemplate$/;

  get(config: InternalAxiosRequestConfig): SchemaTemplateWithOldSchema[] {
    if (!config.url) {
      throw err404(config);
    }

    const schemaIdsParam = getQueryParams(config).schemaIds;
    const schemaIds = (typeof schemaIdsParam === 'string' ? schemaIdsParam : '').split(',').filter(Boolean);
    const templates = getSchemaTemplates();

    if (!schemaIds.length) {
      return templates;
    }

    const result = templates.filter(({ name }) => schemaIds.includes(name));

    if (!result.length) {
      throw err404(config);
    }

    return result;
  }
}

export const schemaTemplatesSyntheticController = new SchemaTemplatesSyntheticController();
