import { When } from '@wdio/cucumber-framework';

import { loading } from './Loading.block';

When(/^жду исчезновения блокирующего страницу лоадера$/, async () => {
  await loading.waitForGlobalHidden();
});
