import { Then, When } from '@wdio/cucumber-framework';
import { featuresListSidebarBlock } from './FeaturesListSidebar.block';

When('я закрываю панель выделенных объектов нажимая на крестик', async function () {
  await featuresListSidebarBlock.close();
});

Then('панель выделенных объектов закрывается', async function () {
  await featuresListSidebarBlock.waitForHidden();
});
