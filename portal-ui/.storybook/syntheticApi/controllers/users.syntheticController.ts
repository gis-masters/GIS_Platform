import { AxiosRequestConfig } from 'axios';

import { CrgUserRaw } from '../../../src/app/services/auth/users/users.models';
import { queryObjects } from '../../../src/app/services/util/queryObjects';
import { users } from '../data/users';
import { SyntheticController } from './_master';
import { err404, parsePageOptions } from '../utils';
import { PageableResponse } from '../../../src/app/services/models';

class UsersSyntheticController implements SyntheticController {
  pattern = /^.*\/users$/;

  get(config: AxiosRequestConfig): PageableResponse<CrgUserRaw> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const result: CrgUserRaw[] = queryObjects(users, pageOptions);
    const totalPages =
      Math.floor(users.length / pageOptions.pageSize) + Number(Boolean(users.length % pageOptions.pageSize));

    return {
      _embedded: {
        users: result
      },
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
