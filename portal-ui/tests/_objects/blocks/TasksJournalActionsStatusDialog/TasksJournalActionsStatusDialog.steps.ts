import { When } from '@wdio/cucumber-framework';

import { tasksJournalActionsStatusDialogBlock } from './TasksJournalActionsStatusDialog.block';

When(
  'в диалоговом окне редактирования статуса задачи в поле {string} я изменяю статус на {string}',
  async function (fieldTitle: string, status: string) {
    await tasksJournalActionsStatusDialogBlock.setChoiceFieldValue(fieldTitle, status);
  }
);

When('я нажимаю кнопку `Сохранить` в диалоговом окне редактирования статуса задачи', async function () {
  await tasksJournalActionsStatusDialogBlock.saveChangeStatusAction();
});
