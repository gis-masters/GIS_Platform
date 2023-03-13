import { Then } from '@wdio/cucumber-framework';

import { workspaceHeaderBlock } from './WorkspaceHeader.block';

Then(/^в хедере страницы название организации — "(.*)"$/, async (organization: string) => {
  await workspaceHeaderBlock.testOrganization(organization);
});
