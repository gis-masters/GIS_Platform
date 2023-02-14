import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { MuiSelect } from '../MuiSelect/MuiSelect.block';

@binding()
class ConnectionsToProjectsWidget extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.ConnectionsToProjectsWidget');
  }

  get $connectionToProjectDialogViewSelector(): Promise<WebdriverIO.Element> {
    return $('.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control');
  }

  get $connectionToProjectDialogAccept(): Promise<WebdriverIO.Element> {
    return $('.ConnectionsToProjectsWidget-Dialog .MuiButton-outlinedPrimary');
  }

  @when(/^в диалоговом окне `Выбор проекта` нажимаю `Подключить`$/)
  async projectSelectDialogProjectAcceptBtn(): Promise<void> {
    const $connectionToProjectDialogAccept = await this.$connectionToProjectDialogAccept;

    const muiSelect = new MuiSelect('.ConnectionsToProjectsWidget-Dialog');
    await muiSelect.selectOption(2);

    await $connectionToProjectDialogAccept.click();
  }

  @then(/^в диалоговом окне `Выбор проекта` доступен выбор представления$/)
  async projectSelectDialogViewSelector(): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.$connectionToProjectDialogViewSelector;
    await $connectionToProjectDialogViewSelector.waitForDisplayed();
  }

  @then(/^в диалоговом окне `Выбор проекта` не доступен выбор представления$/)
  async projectSelectDialogNoViewSelector(): Promise<void> {
    await expect(this.$connectionToProjectDialogViewSelector).not.toBeDisplayed();
  }

  @when(/^в диалоговом окне `Выбор проекта` выбираю первое представление$/)
  async projectSelectDialogSelectFirstView(): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.$connectionToProjectDialogViewSelector;
    await $connectionToProjectDialogViewSelector.waitForDisplayed();

    const muiSelect = new MuiSelect(
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control'
    );
    await muiSelect.selectOption(2);
  }
}

export const connectionsToProjectsWidget = new ConnectionsToProjectsWidget();
