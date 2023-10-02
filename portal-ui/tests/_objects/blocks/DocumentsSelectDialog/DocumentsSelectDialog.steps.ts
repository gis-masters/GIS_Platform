import { When } from '@wdio/cucumber-framework';

import { documentsSelectDialogBlock } from './DocumentsSelectDialog.block';

When('в окне выбора документа я захожу внутрь библиотеки {string}', async (library: string) => {
  await documentsSelectDialogBlock.openLibrary(library);
});

When('в окне выбора документа я переключаюсь на табличный вид', async () => {
  await documentsSelectDialogBlock.switchExplorerView();
});

When('в окне выбора документа я нажимаю Выбрать', async () => {
  await documentsSelectDialogBlock.select();
});
