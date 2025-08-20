/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockOrganizationSettings(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*organizations\/settings$/,
    status: 200,
    response: JSON.stringify({
      downloadFiles: true,
      createProject: true,
      editProjectLayer: true,
      viewDocumentLibrary: true,
      viewBugReport: true,
      downloadGml: true,
      importShp: true,
      viewServicesCalculator: true,
      createLibraryItem: true,
      showPermissions: true,
      taskManagement: true,
      downloadXml: true
    })
  });
}
