import { getMyOfficeIp } from './getMyOfficeIp';
import { config as uiConfig } from './wdio.ui.conf';

export const config: WebdriverIO.Config = {
  ...uiConfig,

  baseUrl: `http://${getMyOfficeIp()}:6006/`,

  specFileRetries: 0
};
