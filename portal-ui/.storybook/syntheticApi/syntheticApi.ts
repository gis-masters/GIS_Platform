import { AxiosAdapter, AxiosError } from 'axios';

import { http } from '../../src/app/services/api/http.service';
import { sleep } from '../../src/app/services/util/sleep';
import { SyntheticController, selectController } from './controllers/masterController';

export function initSyntheticApi() {
  http.axios.interceptors.request.use(async config => {
    config.adapter = (async config => {
      if (!config.url) {
        throw new AxiosError('not found', 'forbidden', config, null, {
          config,
          status: 404,
          statusText: 'not found',
          data: {},
          headers: {}
        });
      }

      if (!config.url.includes('organizations/settings/schema') && !config.url.includes('organizations/settings')) {
        await sleep(Math.random() * 500);
      }

      const controller = selectController(config.url);
      const method = config.method?.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete';

      if (controller && controller[method]) {
        const result = {
          data: (controller[method] as Required<SyntheticController>['get'])(config),
          status: 200,
          statusText: 'ok',
          config
        };

        console.log('api', config.method, config.url, result);

        return result;
      }

      console.error('no synthetic api', config.method, config.url, config);

      throw new AxiosError('no synthetic api', 'no synthetic api', config, null, {
        config,
        status: 500,
        statusText: 'no synthetic api',
        data: {},
        headers: {}
      });
    }) as AxiosAdapter;

    return config;
  });
}
