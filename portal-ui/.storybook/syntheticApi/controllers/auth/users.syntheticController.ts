import { InternalAxiosRequestConfig } from 'axios';

import { CrgUserRaw } from '../../../../src/app/services/auth/users/users.models';
import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { users } from '../../data/users';
import { SyntheticController } from '../masterController';
import { err404, parsePageOptions } from '../../utils';
import { PageableResources } from '../../../../src/server-types/common-contracts';

class UsersSyntheticController implements SyntheticController {
  pattern = /^.*\/users$/;

  get(config: InternalAxiosRequestConfig): PageableResources<CrgUserRaw> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const result: CrgUserRaw[] = queryObjects(users, pageOptions);
    const totalPages =
      Math.floor(users.length / pageOptions.pageSize) + Number(Boolean(users.length % pageOptions.pageSize));

    return {
      content: result,
      page: {
        size: pageOptions.pageSize,
        totalElements: users.length,
        totalPages,
        number: pageOptions.page
      }
    };
  }
}

export const usersSyntheticController = new UsersSyntheticController();
