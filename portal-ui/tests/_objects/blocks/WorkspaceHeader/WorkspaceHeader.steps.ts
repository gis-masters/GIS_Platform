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

When('я нажимаю на ссылку {string} в хлебных крошках в шапке страницы', async (title: string) => {
  await workspaceHeaderBlock.clickBreadcrumbsItem(title);
});

Then('в шапке страницы карты проекта отображаются хлебные крошки: {strings}', async function (breadcrumbs: string) {
  const currentProjectBreadcrumbs = await workspaceHeaderBlock.currentProjectBreadcrumbs();

  await expect(breadcrumbs).toEqual(currentProjectBreadcrumbs);
});
