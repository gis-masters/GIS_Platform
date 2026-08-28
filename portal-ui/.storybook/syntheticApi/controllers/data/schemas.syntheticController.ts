import { type InternalAxiosRequestConfig } from 'axios';

import { type OldSchema } from '../../../../src/app/services/data/schema/schemaOld.models';
import { schemas } from '../../data/schemas';
import { parseBody } from '../../utils';
import { type SyntheticController } from '../masterController';

class SchemasSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/schemas$/;

  post(config: InternalAxiosRequestConfig): OldSchema {
    const schema = parseBody<OldSchema>(config.data);

    schemas.push(schema);

    return schema;
  }
}

export const schemasSyntheticController = new SchemasSyntheticController();
