import {APP_VERSION} from './var';

import { Environment } from './types';

export const environment: Environment = {
  platform: 'conv',
  production: true,
  version: APP_VERSION,
  server: {
    'host': 'localhost',
    'port': 8100
  },
  scratchWorkspaceName: 'scratch_workspace'
};
