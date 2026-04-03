import { When } from '@wdio/cucumber-framework';

import { printMapImageControlBlock } from './PrintMapImageControl.block';

When('жду появления превью выбранного фрагмента в контроле выбора фрагмента карты', async () => {
  await printMapImageControlBlock.waitForSelectedImage();
});

When('в контроле выбора фрагмента карты нажимаю кнопку `Выбрать фрагмент карты`', async () => {
  await printMapImageControlBlock.clickChooseMapFragment();
});
