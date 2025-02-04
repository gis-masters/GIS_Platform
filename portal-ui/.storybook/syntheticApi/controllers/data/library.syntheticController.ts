import { InternalAxiosRequestConfig } from 'axios';

import { LibraryRaw } from '../../../../src/app/services/data/library/library.models';
import { Role } from '../../../../src/app/services/permissions/permissions.models';
import { libraries } from '../../data/libraries';
import { SyntheticController } from '../masterController';
import { err404 } from '../../utils';

class LibrarySyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)$/;

  get(config: InternalAxiosRequestConfig): LibraryRaw {
    const requestedTableName = config.url?.match(this.pattern)?.at(1);
    const library = libraries.find(({ table_name }) => table_name === requestedTableName);

    if (!library) {
      throw err404(config);
    }

    return {
      ...library,
      role: Role.OWNER
    };
  }
}

export const librarySyntheticController = new LibrarySyntheticController();
