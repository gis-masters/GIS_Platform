import { type InternalAxiosRequestConfig } from 'axios';

import { type RoleAssignmentBody } from '../../../../src/app/services/permissions/permissions.models';
import { type PageableResources } from '../../../../src/server-types/common-contracts';
import { parsePageOptions, toPageable } from '../../utils';
import { type SyntheticController } from '../masterController';

class PermissionsSyntheticController implements SyntheticController {
  pattern = /(?:\/roleAssignment|\/projects\/\d+\/permissions)$/;

  get(config: InternalAxiosRequestConfig): RoleAssignmentBody[] | PageableResources<RoleAssignmentBody> {
    if (config.url?.includes('/roleAssignment')) {
      return toPageable([], parsePageOptions(config));
    }

    return [];
  }
}

export const permissionsSyntheticController = new PermissionsSyntheticController();
