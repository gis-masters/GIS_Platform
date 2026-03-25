import { When } from '@wdio/cucumber-framework';

import { printMapImageControlBlock } from './PrintMapImageControl.block';

When('нажимаю на контрол выбора фрагмента карты', async () => {
  await printMapImageControlBlock.clickChooseMapFragment();
});

When('жду появления превью выбранного фрагмента в контроле выбора фрагмента карты', async () => {
  await printMapImageControlBlock.waitForSelectedImage();
});
