import { Then } from '@wdio/cucumber-framework';

import { printMapDialogPreviewImageBlock } from './PrintMapDialogPreviewImage.block';

Then('в окне просмотра печати карты отображается {string}', async (variant: string) => {
  await printMapDialogPreviewImageBlock.assertSelfie(variant.split(' ').join('-'));
});
