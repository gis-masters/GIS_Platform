import { Then, When } from '@wdio/cucumber-framework';

import { CreateReportTemplateBlock } from './CreateReportTemplate.block';

When('в панели инструментов explorer я открываю создание шаблона отчёта', async () => {
  const block = new CreateReportTemplateBlock();
  await block.click();
});

Then('в панели инструментов explorer нет кнопки создания шаблона отчёта', async () => {
  const block = new CreateReportTemplateBlock();
  expect(await block.isExisting()).toBe(false);
});
