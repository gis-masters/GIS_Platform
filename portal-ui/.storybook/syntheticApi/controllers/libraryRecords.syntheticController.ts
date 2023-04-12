import { InternalAxiosRequestConfig } from 'axios';

import { LibraryRecordRaw } from '../../../src/app/services/data/docLibrary/docLibrary.models';
import { queryObjects } from '../../../src/app/services/util/queryObjects';
import { PageableResponse } from '../../../src/app/services/models';
import { libraryRecords } from '../data/libraryRecords';
import { SyntheticController } from './_master';
import { parsePageOptions } from '../utils';

class LibraryRecordsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)\/records.*$/;

  get(config: InternalAxiosRequestConfig): PageableResponse<LibraryRecordRaw> {
    const match = config.url?.match(this.pattern);
    const libraryTableName = match?.at(1) || '';
    const pageOptions = parsePageOptions(config);
    const records = queryObjects(libraryRecords[libraryTableName], pageOptions);
    const totalPages =
      Math.floor(records.length / pageOptions.pageSize) + Number(Boolean(records.length % pageOptions.pageSize));

    return {
      _embedded: {
        records: records.map(record => ({ content: record }))
      },
      page: {
        size: pageOptions.pageSize,
        totalElements: records.length,
        totalPages,
        number: pageOptions.page
      }
    };
  }
}

export const libraryRecordsSyntheticController = new LibraryRecordsSyntheticController();
