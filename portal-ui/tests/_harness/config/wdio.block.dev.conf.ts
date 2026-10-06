import { getMyOfficeIp } from './getMyOfficeIp';
import { config as blockConfig } from './wdio.block.conf';

export const config: WebdriverIO.Config = {
  ...blockConfig,

  baseUrl: `http://${getMyOfficeIp()}:6006/`,

  specFileRetries: 0
};
