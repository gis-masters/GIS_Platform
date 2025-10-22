import { getMyOfficeIp } from '../wdio.conf';
import { config as baseConfig } from './wdio.conf';

export const config: WebdriverIO.Config = {
  ...baseConfig,

  baseUrl: `http://${getMyOfficeIp()}:4200`,

  specFileRetries: 0
};
