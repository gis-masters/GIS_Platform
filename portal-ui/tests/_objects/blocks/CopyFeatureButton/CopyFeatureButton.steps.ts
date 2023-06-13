import { When } from '@wdio/cucumber-framework';
import { copyFeatureButtonBlock } from './CopyFeatureButton.block';

When('на панели выделенного объекта я нажимаю `Копировать объект в другой слой`', async function () {
  await copyFeatureButtonBlock.click();
});
