import { InternalAxiosRequestConfig } from 'axios';

import { LibraryRecordRaw } from '../../../../src/app/services/data/library/library.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { libraryRecords } from '../../data/libraryRecords';
import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';

class LibraryRecordSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)\/records\/(\d*)$/;

  get(config: InternalAxiosRequestConfig): LibraryRecordRaw {
    const match = config.url?.match(this.pattern);
    const libraryTableName = match?.at(1) || '';
    const recordId = Number(match?.at(2));
    const record = libraryRecords[libraryTableName]?.find(({ id }) => id === recordId);

    if (!record) {
      throw err404(config);
    }

    return {
      ...record,
      role: record._role || Role.VIEWER,
      _role: undefined
    };
  }
}

export const libraryRecordSyntheticController = new LibraryRecordSyntheticController();
