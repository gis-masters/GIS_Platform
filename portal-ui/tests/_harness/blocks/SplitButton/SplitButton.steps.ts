import { When } from '@wdio/cucumber-framework';

import { splitButtonBlock } from './SplitButton.block';

When('я нажимаю основную кнопку SplitButton', async () => {
  await splitButtonBlock.clickMain();
});

When('я нажимаю кнопку SplitButton {string}', async (label: string) => {
  await splitButtonBlock.clickByLabel(label);
});
