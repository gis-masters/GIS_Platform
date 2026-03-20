import { Then } from '@wdio/cucumber-framework';

import { type ScenarioScope } from '../../ScenarioScope';
import { taskPageBlock } from './TaskPage.block';

Then('на странице задачи отображается карточка созданной задачи', async function (this: ScenarioScope) {
  await taskPageBlock.isCardExist();
  await taskPageBlock.isActionsExist();
  const currentTitle = await taskPageBlock.getCardTitle();

  expect(currentTitle).toEqual(`Задача №${this.latestTask.id}id: ${this.latestTask.id}`);
});
