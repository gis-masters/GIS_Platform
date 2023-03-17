import { AxiosRequestConfig } from 'axios';

import { RoleAssignmentBody } from '../../../src/app/services/data/permissions/permissions.models';
import { PageableResponse } from '../../../src/app/services/models';
import { err404, parsePageOptions } from '../utils';
import { SyntheticController } from './_master';

class LibraryRecordPermissionsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)\/records\/(\d*)\/roleAssignment$/;

  get(config: AxiosRequestConfig): PageableResponse<RoleAssignmentBody> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);

    return {
      page: {
        size: pageOptions.pageSize,
        totalElements: 0,
        totalPages: 0,
        number: 0
      }
    };
  }
}

export const libraryRecordPermissionsSyntheticController = new LibraryRecordPermissionsSyntheticController();
