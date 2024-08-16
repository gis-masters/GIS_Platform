import { Then, When } from '@wdio/cucumber-framework';

import { editFeatureSidebarBlock } from './EditFeatureSidebar.block';

Then('открывается панель редактирования объекта', async function () {
  await editFeatureSidebarBlock.waitForVisible();
});

When('на панели выделенного объекта я нажимаю `Копировать объект в другой слой`', async function () {
  await editFeatureSidebarBlock.copyFeaturesButton.click();
});

When('я закрываю панель выделенного объекта', async function () {
  await editFeatureSidebarBlock.closeFeatureSidebar();
});
