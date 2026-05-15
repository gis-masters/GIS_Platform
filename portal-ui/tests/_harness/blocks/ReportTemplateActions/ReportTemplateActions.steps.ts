import { Then, When } from '@wdio/cucumber-framework';

import { ReportTemplateActionsBlock } from './ReportTemplateActions.block';

When('в панели действий шаблона отчёта я нажимаю удалить', async () => {
  const block = new ReportTemplateActionsBlock();
  await block.clickDelete();
});

When('в панели действий шаблона отчёта я нажимаю редактировать', async () => {
  const block = new ReportTemplateActionsBlock();
  await block.clickEdit();
});

Then('в панели действий шаблона отчёта нет кнопки удаления', async () => {
  const block = new ReportTemplateActionsBlock();
  await browser.waitUntil(async () => !(await block.isDeleteButtonDisplayed()), {
    timeoutMsg: 'Кнопка удаления не должна отображаться для пользователя без прав администратора'
  });
});

Then('в панели действий шаблона отчёта кнопка удаления отключена', async () => {
  const block = new ReportTemplateActionsBlock();
  expect(await block.isDeleteButtonDisabled()).toBe(true);
});

Then('в панели действий шаблона отчёта нет кнопки редактирования', async () => {
  const block = new ReportTemplateActionsBlock();
  await browser.waitUntil(async () => !(await block.isEditButtonDisplayed()), {
    timeoutMsg: 'Кнопка редактирования не должна отображаться для пользователя без прав администратора'
  });
});

Then('в панели действий шаблона отчёта кнопка редактирования отключена', async () => {
  const block = new ReportTemplateActionsBlock();
  expect(await block.isEditButtonDisabled()).toBe(true);
});
