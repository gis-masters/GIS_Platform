import { Then, When } from '@wdio/cucumber-framework';

import { workspaceHeaderBlock } from './WorkspaceHeader.block';

Then('в шапке страницы название организации — {string}', async (organization: string) => {
  await workspaceHeaderBlock.testOrganization(organization);
});

When('я дожидаюсь исчезновения индикатора загрузки карты в шапке страницы', async () => {
  await workspaceHeaderBlock.waitForLoaderEnd();
});

When('я нажимаю на кнопку `Распечатать карту` в шапке страницы', async () => {
  await workspaceHeaderBlock.clickPrintMap();
});
