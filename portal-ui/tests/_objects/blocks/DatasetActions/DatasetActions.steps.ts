import { Then, When } from '@wdio/cucumber-framework';

import { datasetActionsBlock } from './DatasetActions.block';

When('я нажимаю кнопку удалить в панели свойств набора данных', async () => {
  await datasetActionsBlock.clickDeleteBtn();
});

Then('в панели свойств набора данных нет кнопки удаления', async () => {
  await datasetActionsBlock.deleteBtnNotExist();
});

Then('в панели свойств набора данных нет кнопки редактирования', async () => {
  await datasetActionsBlock.editBtnNotExist();
});

Then('в панели свойств набора данных есть кнопка редактирования', async () => {
  await datasetActionsBlock.editBtnExist();
});

When('нажимаю на кнопку подтверждения удаления набора данных в появившемся диалоговом окне', async () => {
  await datasetActionsBlock.confirmDeletion();
});

Then('появляется диалоговое окно запрещающее удаление', async () => {
  await datasetActionsBlock.prohibitDeletionDialog();
});
