import { InternalAxiosRequestConfig } from 'axios';

import { Library } from '../../../../src/app/services/data/library/library.models';
import { PageableResources } from '../../../../src/server-types/common-contracts';
import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { SyntheticController } from '../masterController';
import { libraries } from '../../data/libraries';
import { parsePageOptions } from '../../utils';

class LibrariesSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries$/;

  get(config: InternalAxiosRequestConfig): PageableResources<Omit<Library, 'role'>> {
    const pageOptions = parsePageOptions(config);
    console.log('pageOptions', pageOptions);
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
