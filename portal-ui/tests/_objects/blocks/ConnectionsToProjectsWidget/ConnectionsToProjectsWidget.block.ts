import { Block } from '../../Block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

class ConnectionsToProjectsWidgetBlock extends Block {
  selectors = {
    container: '.ConnectionsToProjectsWidget',
    connectionToProjectDialogViewSelector:
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control',
    connectionToProjectDialogAccept: '.ConnectionsToProjectsWidget-Dialog .MuiButton-outlinedPrimary'
  };

  async projectSelectDialogProjectAcceptBtn(): Promise<void> {
    const $connectionToProjectDialogAccept = await this.$('connectionToProjectDialogAccept');
    await $connectionToProjectDialogAccept.waitForClickable();
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

  async projectSelectDialogSelectFirstView(optionTitle: string): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.$('connectionToProjectDialogViewSelector');
    await $connectionToProjectDialogViewSelector.waitForDisplayed();

    const muiSelect = new MuiSelectBlock(
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control'
    );
    await muiSelect.selectOptionByTitle(optionTitle);
  }
}

export const connectionsToProjectsWidgetBlock = new ConnectionsToProjectsWidgetBlock();
