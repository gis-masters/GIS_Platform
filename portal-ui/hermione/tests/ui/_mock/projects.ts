/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockProjects(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*\/projects.*/,
    status: 200,
    response: JSON.stringify({
      content: [
        {
          id: 39,
          name: 'Название проекта',
          internalName: 'workspace_39',
          createdAt: '2021-07-30T13:10:53.506597',
          organizationId: 10,
          default: false
        }
      ],
      page: {
        size: 300,
        totalElements: 1,
        totalPages: 1,
        number: 0
      }
    })
  });
}
