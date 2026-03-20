import { Then } from '@wdio/cucumber-framework';

import { breadcrumbsBlock } from './Breadcrumbs.block';

Then('блок Breadcrumbs вариант {string} выглядит как положено', async (variant: string) => {
  await breadcrumbsBlock.assertSelfie(variant);
});

Then('в хлебных крошках страницы проектов отображается: {strings}', async function (breadcrumbs: string) {
  const currentBreadcrumbs = await breadcrumbsBlock.getItemsText();

  expect(breadcrumbs).toEqual(currentBreadcrumbs);
});
