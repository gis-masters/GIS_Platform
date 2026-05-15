import { Given } from '@wdio/cucumber-framework';

import { createUserReportTemplateForTest } from '../commands/reportTemplates/createUserReportTemplateForTest';
import { deleteAllUserReportTemplates } from '../commands/reportTemplates/deleteAllUserReportTemplates';

Given('удалены все пользовательские шаблоны отчётов', async () => {
  await deleteAllUserReportTemplates();
});

Given(
  'существует пользовательский шаблон отчётов с идентификатором {string} и названием {string}',
  async (name: string, title: string) => {
    await createUserReportTemplateForTest(name, title);
  }
);
