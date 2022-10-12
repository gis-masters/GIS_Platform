/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockOrganizationSettings(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*organizations\/settings$/,
    status: 200,
    response: JSON.stringify({
      fileDownload: true,
      createProject: true,
      dataManagement: true,
      editProjectLayer: true,
      createLibraryItem: true,
      downloadXml: true
    })
  });
}
