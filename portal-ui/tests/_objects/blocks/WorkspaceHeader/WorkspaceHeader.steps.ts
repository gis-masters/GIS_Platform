import { Then } from '@wdio/cucumber-framework';

import { workspaceHeader } from './WorkspaceHeader.block';

Then(/^в хедере страницы название организации — "(.*)"$/, async (organization: string) => {
  await workspaceHeader.testOrganization(organization);
});
