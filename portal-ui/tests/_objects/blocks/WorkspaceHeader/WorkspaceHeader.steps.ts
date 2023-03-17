import { Then } from '@wdio/cucumber-framework';

import { workspaceHeaderBlock } from './WorkspaceHeader.block';

Then(/^в шапке страницы название организации — "(.*)"$/, async (organization: string) => {
  await workspaceHeaderBlock.testOrganization(organization);
});
