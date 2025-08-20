import { Then } from '@wdio/cucumber-framework';

import { photModePreviewerBlock } from './PhotoModePreviewer.block';

Then('появляется окно предпросмотра фотослоя', async function () {
  await photModePreviewerBlock.waitForVisible();
});

Then('в компоненте просмотра фотослоя {string} фотографий', async function (count: number) {
  await photModePreviewerBlock.photosCountChecking(Number(count));
});
