import { type InternalAxiosRequestConfig } from 'axios';

import { type PageableResources, type SpatialReferenceSystem } from '../../../../src/server-types/common-contracts';
import { parsePageOptions, toPageable } from '../../utils';
import { type SyntheticController } from '../masterController';

class SrsSyntheticController implements SyntheticController {
  pattern = /^.*\/api\/data\/srs$/;

  get(config: InternalAxiosRequestConfig): PageableResources<SpatialReferenceSystem> {
    return toPageable([], parsePageOptions(config));
  }
}

export const srsSyntheticController = new SrsSyntheticController();
