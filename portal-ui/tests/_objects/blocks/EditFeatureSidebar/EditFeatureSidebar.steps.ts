import { Then } from '@wdio/cucumber-framework';

import { editFeatureSidebarBlock } from './EditFeatureSidebar.block';

Then('открывается панель редактирования объекта', async function () {
  await editFeatureSidebarBlock.waitForVisible();
});
