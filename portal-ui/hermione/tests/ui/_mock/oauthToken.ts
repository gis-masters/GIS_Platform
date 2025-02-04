/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockOauthToken(browser: WebdriverIO.Browser) {
  await mockApi(browser, { method: 'post', url: /.*\/oauth\/token$/, status: 200, response: 'fake token' });
}
