import { AxiosRequestConfig } from 'axios';

import { CrgGroup } from '../../../src/app/services/auth/groups.service';
import { queryObjects } from '../../../src/app/services/util/queryObjects';
import { groups } from '../data/groups';
import { SyntheticController } from './_master';
import { err404, parsePageOptions } from '../utils';
import { PageableResponse } from '../../../src/app/services/models';

class GroupsSyntheticController implements SyntheticController {
  pattern = /^.*\/groups$/;

  get(config: AxiosRequestConfig): PageableResponse<CrgGroup> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const result: CrgGroup[] = queryObjects(groups, pageOptions);
    const totalPages =
      Math.floor(groups.length / pageOptions.pageSize) + Number(Boolean(groups.length % pageOptions.pageSize));

    return {
      _embedded: {
        groups: result
      },
      page: {
        size: pageOptions.pageSize,
        totalElements: groups.length,
        totalPages,
        number: Math.min(pageOptions.page, totalPages - 1)
      }
    };
  }
}

export const groupsSyntheticController = new GroupsSyntheticController();
