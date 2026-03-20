import { CustomCache } from '../../common/CustomCache';
import { type Schema } from './schema.models';

class TablesSchemasCache extends CustomCache<Promise<Schema>> {
  private static _instance: TablesSchemasCache;

  static get instance(): TablesSchemasCache {
    if (!this._instance) {
      this._instance = new TablesSchemasCache();
    }

    return this._instance;
  }
}

export const tablesSchemasCache = TablesSchemasCache.instance;
