import { Then } from '@wdio/cucumber-framework';

import { breadcrumbsBlock } from './Breadcrumbs.block';

Then('блок Breadcrumbs вариант {string} выглядит как положено', async (variant: string) => {
  await breadcrumbsBlock.assertSelfie(variant);
});
