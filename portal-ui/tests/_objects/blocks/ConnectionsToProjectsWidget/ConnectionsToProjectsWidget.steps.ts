import { Then, When } from '@wdio/cucumber-framework';

import { connectionsToProjectsWidgetBlock } from './ConnectionsToProjectsWidget.block';

When('в диалоговом окне `Выбор проекта` нажимаю `Подключить`', async () => {
  await connectionsToProjectsWidgetBlock.projectSelectDialogProjectAcceptBtn();
});

Then('в диалоговом окне `Выбор проекта` доступен выбор представления', async () => {
  await connectionsToProjectsWidgetBlock.projectSelectDialogViewSelector();
});

Then('в диалоговом окне `Выбор проекта` не доступен выбор представления', async () => {
  await connectionsToProjectsWidgetBlock.projectSelectDialogNoViewSelector();
});

When('в диалоговом окне `Выбор проекта` выбираю первое представление', async () => {
  await connectionsToProjectsWidgetBlock.projectSelectDialogSelectFirstView('Представление 1');
});
