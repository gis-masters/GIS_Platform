import { boundClass } from 'autobind-decorator';

import { Schema } from '../data/schema/schema.models';
import { Cache } from './cache';

@boundClass
class SchemaCacheService extends Cache<Schema> {
  private static _instance: SchemaCacheService;

  static get instance(): SchemaCacheService {
    if (!this._instance) {
      this._instance = new SchemaCacheService();
    }

    return this._instance;
  }
}

export const schemaCacheService = SchemaCacheService.instance;
