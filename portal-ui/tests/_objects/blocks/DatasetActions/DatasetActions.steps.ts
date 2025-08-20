import { Then, When } from '@wdio/cucumber-framework';

import { utilityDialogBlock } from '../UtilityDialog/UtilityDialog.block';
import { datasetActionsBlock } from './DatasetActions.block';

When('я нажимаю кнопку удалить в панели свойств набора данных', async () => {
  await datasetActionsBlock.clickDeleteBtn();
});

Then('в панели свойств набора данных есть кнопка удаления, но она неактивна', async () => {
  void expect(await datasetActionsBlock.isDeleteBtnEnabled()).toBeFalsy();
});

Then('в панели свойств набора данных есть кнопка удаления, и она активна', async () => {
  await expect(await datasetActionsBlock.isDeleteBtnEnabled()).toBe(true);
});

Then('в панели свойств набора данных есть кнопка редактирования, и она активна', async () => {
  await expect(await datasetActionsBlock.isEditBtnEnabled()).toBe(true);
});

Then('в панели свойств набора данных есть кнопка редактирования, но она неактивна', async () => {
  await expect(await datasetActionsBlock.isDeleteBtnEnabled()).toBeFalsy();
});

When('я открываю карточку редактирования набора данных', async () => {
  await datasetActionsBlock.clickEditBtn();
});

When(
  'в карточке редактирования набора данных я изменяю значение поля {string} на {string}',
  async (field: string, value: string) => {
    await datasetActionsBlock.editDataset(field, value);
  }
);

Then('появляется диалоговое окно запрещающее удаление', async () => {
  await utilityDialogBlock.waitForVisible();
});
