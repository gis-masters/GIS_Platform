import { When } from '@wdio/cucumber-framework';

import { selectFolderDialogBlock } from './SelectFolderDialog.block';

When('в окне выбора папки я нажимаю `Выбрать` у элемента {string}', async function (explorerItemTitle: string) {
  await selectFolderDialogBlock.selectFolder(explorerItemTitle);
});

When(
  'в окне выбора папки для для создания дочернего документа я захожу в библиотеку {string}',
  async function (library: string) {
    await selectFolderDialogBlock.openExplorerItem(library);
  }
);
