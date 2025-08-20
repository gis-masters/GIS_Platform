import { InternalAxiosRequestConfig } from 'axios';

import { CrgGroup } from '../../../../src/app/services/auth/groups/groups.models';
import { queryObjects } from '../../../../src/app/services/util/queryObjects';
import { groups } from '../../data/groups';
import { SyntheticController } from '../masterController';
import { err404, parsePageOptions } from '../../utils';
import { PageableResources } from '../../../../src/server-types/common-contracts';

class GroupsSyntheticController implements SyntheticController {
  pattern = /^.*\/groups$/;

  get(config: InternalAxiosRequestConfig): PageableResources<CrgGroup> {
    if (!config.url) {
      throw err404(config);
    }

    const pageOptions = parsePageOptions(config);
    const result: CrgGroup[] = queryObjects(groups, pageOptions);
    const totalPages =
      Math.floor(groups.length / pageOptions.pageSize) + Number(Boolean(groups.length % pageOptions.pageSize));

    return {
      content: result,
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
