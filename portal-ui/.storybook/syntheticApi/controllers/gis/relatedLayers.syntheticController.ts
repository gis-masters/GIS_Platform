import { type InternalAxiosRequestConfig } from 'axios';

import { type VectorTableConnection } from '../../../../src/app/services/data/vectorData/vectorData.models';
import { type SyntheticController } from '../masterController';

class RelatedLayersSyntheticController implements SyntheticController {
  pattern = /\/projects\/find-related-layers/;

  get(_config: InternalAxiosRequestConfig): VectorTableConnection[] {
    return [];
  }
}

export const relatedLayersSyntheticController = new RelatedLayersSyntheticController();
