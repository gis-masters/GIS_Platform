/// <reference path='../../../../node_modules/hermione/typings/webdriverio/index.d.ts' />

import { mockApi } from '../../../objects/commands/mockApi';

export async function mockUsersCurrent(browser: WebdriverIO.Browser) {
  await mockApi(browser, {
    method: 'get',
    url: /.*users\/current$/,
    status: 200,
    response: JSON.stringify({
      id: 59,
      name: 'Granger',
      login: 'hermione@test',
      middleName: null,
      surname: 'Hermione',
      job: null,
      phone: null,
      email: 'hermione@test',
      enabled: true,
      authorities: ['ORG_ADMIN'],
      createdAt: '2021-07-30T09:35:23.183358',
      orgName: 'Hogwarts',
      orgId: 10
    })
  });
}
