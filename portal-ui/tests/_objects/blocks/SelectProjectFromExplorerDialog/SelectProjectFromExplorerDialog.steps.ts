import { Then, When } from '@wdio/cucumber-framework';

import { selectProjectFromExplorerDialogBlock } from './SelectProjectFromExplorerDialog.block';

When(
  'в появившемся диалоговом окне перемещения проекта я выбираю элемент {string}',
  async function (explorerItemTitle: string) {
    await selectProjectFromExplorerDialogBlock.selectFolder(explorerItemTitle);
  }
);

When(
  'в появившемся диалоговом окне подтверждения перемещения проекта нажимаю на кнопку `Переместить`',
  async function () {
    await selectProjectFromExplorerDialogBlock.saveSelectedFolder();
  }
);

Then('в появившемся диалоговом окне перемещения проекта все элементы недоступны', async function () {
  const disabled = await selectProjectFromExplorerDialogBlock.allItemsIsDisabled();

  await expect(disabled).toEqual(true);
});
