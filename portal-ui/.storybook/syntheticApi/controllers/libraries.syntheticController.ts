import { AxiosRequestConfig } from 'axios';

import { DocumentLibrary } from '../../../src/app/services/data/doc-library.service';
import { PageableResources } from '../../../src/server-types/common-contracts';
import { queryObjects } from '../../../src/app/services/util/queryObjects';
import { SyntheticController } from './_master';
import { libraries } from '../data/libraries';
import { parsePageOptions } from '../utils';

class LibrariesSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries$/;

  get(config: AxiosRequestConfig): PageableResources<Omit<DocumentLibrary, 'role'>> {
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
