import { Then } from '@wdio/cucumber-framework';

import { urlListDialogBlock } from './UrlListDialog.block';

Then('блок UrlListDialog вариант {string} выглядит как положено', async (variant: string) => {
  await urlListDialogBlock.assertSelfie(variant);
});
