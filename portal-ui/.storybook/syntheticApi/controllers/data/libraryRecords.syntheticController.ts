import { type InternalAxiosRequestConfig } from 'axios';

import { type LibraryRecordRaw } from '../../../../src/app/services/data/library/library.models';
import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { libraryRecords } from '../../data/libraryRecords';
import { parsePageOptions } from '../../utils';
import { type SyntheticController } from '../masterController';

class LibraryRecordsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?/#]*)\/records.*$/;

  get(config: InternalAxiosRequestConfig): PageableResources<{ content: LibraryRecordRaw }> {
    const match = config.url?.match(this.pattern);
    const libraryTableName = match?.at(1) || '';
    const pageOptions = parsePageOptions(config);
    const records = queryObjects(libraryRecords[libraryTableName], pageOptions);
    const totalPages =
      Math.floor(records.length / pageOptions.pageSize) + Number(Boolean(records.length % pageOptions.pageSize));

    return {
      content: records.map(record => ({ content: record })),
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
