import { DataTable } from '@cucumber/cucumber';
import { Then, When } from '@wdio/cucumber-framework';

import { ScenarioScope } from '../../ScenarioScope';
import { tasksJournalBlock } from './TasksJournal.block';

When('на странице журнала задач я нажимаю на кнопку открытия меню создания задачи', async function () {
  await tasksJournalBlock.clickCreateTaskMenuBtn();
});

When('на странице журнала задач в меню создания задачи я выбираю пункт {string}', async function (menuOption: string) {
  await tasksJournalBlock.selectItemInCreateTaskMenu(menuOption);
});

When(
  'на странице журнала задач у созданной задачи в меню управления я выбираю пункт {string}',
  async function (this: ScenarioScope, menuItemTitle: string) {
    await tasksJournalBlock.selectTaskMenuAction(String(this.latestTask.id), menuItemTitle);
  }
);

When(
  'в таблице на странице журнала задач существует задача с значениями:',
  async function (this: ScenarioScope, formValues: DataTable) {
    const values = formValues.raw()[1];
    const currentValues = await tasksJournalBlock.getTaskRowValue();
    const staticFieldsValue = [currentValues[2], currentValues[3], currentValues[6], currentValues[7]];

    await expect(staticFieldsValue).toEqual(values);
  }
);

Then(
  'в таблице на странице журнала у созданной задачи статус изменяется на {string}',
  async function (this: ScenarioScope, status: string) {
    const currentStatus = await tasksJournalBlock.getTaskStatus(String(this.latestTask.id));

    await expect(currentStatus).toEqual(status);
  }
);
