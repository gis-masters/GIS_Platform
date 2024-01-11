import { InternalAxiosRequestConfig } from 'axios';

import { RoleAssignmentBody } from '../../../src/app/services/data/permissions/permissions.models';
import { PageableResources } from '../../../src/server-types/common-contracts';
import { err404, parsePageOptions } from '../utils';
import { SyntheticController } from './_master';

class LibraryRecordPermissionsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/document-libraries\/([^?\/#]*)\/records\/(\d*)\/roleAssignment$/;

  get(config: InternalAxiosRequestConfig): PageableResources<RoleAssignmentBody> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);

    return {
      content: [],
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
