/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockSettings(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*organizations\/settings$/,
    status: 200,
    response: JSON.stringify({
      id: '10',
      system: {
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        editProjectLayer: true,
        viewDocumentLibrary: true,
        viewBugReport: true,
        downloadGml: true,
        importShp: true,
        viewServicesCalculator: true,
        taskManagement: true,
        showPermissions: true,
        createLibraryItem: true
      },
      organization: {
        downloadXml: true,
        createProject: true,
        downloadFiles: true,
        editProjectLayer: true,
        viewDocumentLibrary: true,
        viewBugReport: true,
        downloadGml: true,
        importShp: true,
        viewServicesCalculator: true,
        taskManagement: true,
        showPermissions: true,
        createLibraryItem: true
      }
    })
  });
}
