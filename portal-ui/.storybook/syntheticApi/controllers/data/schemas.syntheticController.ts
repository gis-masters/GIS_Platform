import { InternalAxiosRequestConfig } from 'axios';

import { OldSchema } from '../../../../src/app/services/data/schema/schemaOld.models';
import { SyntheticController } from '../masterController';
import { schemas } from '../../data/schemas';
import { err404 } from '../../utils';

class SchemasSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/schemas$/;

  get(config: InternalAxiosRequestConfig): OldSchema[] {
    const names = config.params?.schemaIds?.split(',');
    const result = schemas.filter(({ name }) => names?.includes(name));

    if (!result.length) {
      throw err404(config);
    }

    return result;
  }
}

export const schemasSyntheticController = new SchemasSyntheticController();
