import { Block } from '../../Block';
import { MuiSelect } from '../MuiSelect/MuiSelect.block';

class ConnectionsToProjectsWidget extends Block {
  selectors = {
    container: '.ConnectionsToProjectsWidget',
    connectionToProjectDialogViewSelector:
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control',
    connectionToProjectDialogAccept: '.ConnectionsToProjectsWidget-Dialog .MuiButton-outlinedPrimary'
  };

  async projectSelectDialogProjectAcceptBtn(): Promise<void> {
    const $connectionToProjectDialogAccept = await this.$('connectionToProjectDialogAccept');

    const muiSelect = new MuiSelect('.ConnectionsToProjectsWidget-Dialog');
    await muiSelect.selectOption(2);

    await $connectionToProjectDialogAccept.click();
    await $connectionToProjectDialogAccept.waitForDisplayed({ reverse: true });
  }

  async projectSelectDialogViewSelector(): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.$('connectionToProjectDialogViewSelector');
    await $connectionToProjectDialogViewSelector.waitForDisplayed();
  }

  async projectSelectDialogNoViewSelector(): Promise<void> {
    await expect(this.$('connectionToProjectDialogViewSelector')).not.toBeDisplayed();
  }

  async projectSelectDialogSelectFirstView(): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.$('connectionToProjectDialogViewSelector');
    await $connectionToProjectDialogViewSelector.waitForDisplayed();

    const muiSelect = new MuiSelect(
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control'
    );
    await muiSelect.selectOption(2);
  }
}

export const connectionsToProjectsWidget = new ConnectionsToProjectsWidget();
