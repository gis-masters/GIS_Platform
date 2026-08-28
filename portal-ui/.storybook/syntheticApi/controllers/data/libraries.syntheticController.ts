import { type InternalAxiosRequestConfig } from 'axios';

import { type LibraryRaw } from '../../../../src/app/services/data/library/library.models';
import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { libraries } from '../../data/libraries';
import { parsePageOptions } from '../../utils';
import { type SyntheticController } from '../masterController';

class LibrariesSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries$/;

  get(config: InternalAxiosRequestConfig): PageableResources<Omit<LibraryRaw, 'role'>> {
    const pageOptions = parsePageOptions(config);
    const result = queryObjects(libraries, pageOptions);
    const totalPages =
      Math.floor(result.length / pageOptions.pageSize) + Number(Boolean(result.length % pageOptions.pageSize));

    return {
      content: result,
      page: {
        size: pageOptions.pageSize,
        totalElements: result.length,
        totalPages,
        number: pageOptions.page
      }
    };
  }
}

export const librariesSyntheticController = new LibrariesSyntheticController();
