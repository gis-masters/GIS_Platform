import { When } from '@wdio/cucumber-framework';

import { breadcrumbsStory } from './BreadcrumbsStory.block';

When(/^я устанавливаю ширину хлебных крошек в (\d*) пикселей$/, async (width: string) => {
  await breadcrumbsStory.setWidth(width);
});
