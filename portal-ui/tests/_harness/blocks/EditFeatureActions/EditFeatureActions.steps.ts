import { When } from '@wdio/cucumber-framework';

import { editFeatureActionsBlock } from './EditFeatureActions.block';

When('на панели выделенного объекта я нажимаю `Печать`', async function () {
  await editFeatureActionsBlock.clickPrintAction();
});
