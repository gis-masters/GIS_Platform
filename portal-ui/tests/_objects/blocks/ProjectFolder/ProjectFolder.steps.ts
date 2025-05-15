import { Then, When } from '@wdio/cucumber-framework';

import { projectFolderBlock } from './ProjectFolder.block';

When('я перехожу внутрь папки проекта {string}', async (folder: string) => {
  await projectFolderBlock.openFolder(folder);
});

Then('появляется диалоговое окно запрещающее удаление папки проекта', async () => {
  await projectFolderBlock.deleteConfirmDialog();
});
