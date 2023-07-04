import { When } from '@wdio/cucumber-framework';

import { loadingBlock } from './Loading.block';

When('жду исчезновения блокирующего страницу лоадера', async () => {
  await loadingBlock.waitForGlobalHidden();
});
