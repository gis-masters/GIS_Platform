import {APP_VERSION} from './var';

import { Environment } from './types';

export const environment: Environment = {
  platform: 'conv',
  production: false,
  version: APP_VERSION,
  server: {
    'host': '10.10.10.58',
    'port': 8100
  },
  scratchWorkspaceName: 'scratch_workspace'
};
