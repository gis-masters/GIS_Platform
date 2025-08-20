import { When } from '@wdio/cucumber-framework';

import { taskJournalHistoryDialogBlock } from './TaskJournalHistoryDialog.block';

When('открывается диалоговое окно `История изменений задачи`', async function () {
  await taskJournalHistoryDialogBlock.waitForVisible();
});
