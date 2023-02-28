import { Then, When } from '@wdio/cucumber-framework';

import { connectionsToProjectsWidget } from './ConnectionsToProjectsWidget.block';

When(/^в диалоговом окне `Выбор проекта` нажимаю `Подключить`$/, async () => {
  await connectionsToProjectsWidget.projectSelectDialogProjectAcceptBtn();
});

Then(/^в диалоговом окне `Выбор проекта` доступен выбор представления$/, async () => {
  await connectionsToProjectsWidget.projectSelectDialogViewSelector();
});

Then(/^в диалоговом окне `Выбор проекта` не доступен выбор представления$/, async () => {
  await connectionsToProjectsWidget.projectSelectDialogNoViewSelector();
});

When(/^в диалоговом окне `Выбор проекта` выбираю первое представление$/, async () => {
  await connectionsToProjectsWidget.projectSelectDialogSelectFirstView();
});
