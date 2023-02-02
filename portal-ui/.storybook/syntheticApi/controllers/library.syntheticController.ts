import { AxiosRequestConfig } from 'axios';

import { DocumentLibrary } from '../../../src/app/services/data/doc-library.service';
import { Role } from '../../../src/app/services/data/permissions.models';
import { libraries } from '../data/libraries';
import { SyntheticController } from './_master';
import { err404 } from '../utils';

class LibrarySyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)$/;

  get(config: AxiosRequestConfig): DocumentLibrary {
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
