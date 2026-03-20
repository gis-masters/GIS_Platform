import { getMyOfficeIp } from './getMyOfficeIp';
import { config as e2eConfig } from './wdio.e2e.conf';

export const config: WebdriverIO.Config = {
  ...e2eConfig,

  baseUrl: `http://${getMyOfficeIp()}:4200`,

  specFileRetries: 0
};
