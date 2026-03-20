import { When } from '@wdio/cucumber-framework';

import { breadcrumbsStoryBlock } from './BreadcrumbsStory.block';

When(/^я устанавливаю ширину хлебных крошек в (\d*) пикселей$/, async (width: string) => {
  await breadcrumbsStoryBlock.setWidth(width);
});
