import { Then, When } from '@wdio/cucumber-framework';

import { printMapDialogPreviewImageContainerBlock } from './PreviewImageContainer/PrintMapDialog-PreviewImageContainer.block';
import { printMapDialogBlock } from './PrintMapDialog.block';

Then('в окне просмотра печати карты отображается {string}', async (variant: string) => {
  await printMapDialogPreviewImageContainerBlock.assertSelfie(variant.split(' ').join('-'));
});

When('жду отображения диалога выбора фрагмента карты', async () => {
  await printMapDialogBlock.waitForVisible();
});

When('в диалоге выбора фрагмента карты жду готовности превью', async () => {
  await printMapDialogBlock.waitForPreviewReady();
});

When('в диалоге выбора фрагмента карты нажимаю основную кнопку действия', async () => {
  await printMapDialogBlock.clickPrimaryAction();
});
