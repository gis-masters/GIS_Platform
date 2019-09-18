import {APP_VERSION} from './var';

import { Environment } from './types';

export const environment: Environment = {
  platform: 'simf',
  production: true,
  version: APP_VERSION,
  server: {
    'host': 'simf-region.mycrg.ru',
    'port': 8100
  },
  scratchWorkspaceName: 'scratch_workspace'
};
