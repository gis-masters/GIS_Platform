import { Block } from '../../Block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

class ConnectionsToProjectsWidgetBlock extends Block {
  selectors = {
    root: '.ConnectionsToProjectsWidget',
    connectionToProjectDialogViewSelector:
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control',
    connectionToProjectDialogAccept: '.ConnectionsToProjectsWidget-Dialog .MuiButton-outlinedPrimary'
  };

  async projectSelectDialogProjectAcceptBtn(): Promise<void> {
    const $connectionToProjectDialogAccept = await this.findBySelector('connectionToProjectDialogAccept');
    await $connectionToProjectDialogAccept.waitForClickable();
    await $connectionToProjectDialogAccept.click();
    await $connectionToProjectDialogAccept.waitForExist({ reverse: true });
  }

  async projectSelectDialogViewSelector(): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.findBySelector('connectionToProjectDialogViewSelector');
    await $connectionToProjectDialogViewSelector.waitForDisplayed();
  }

  async projectSelectDialogNoViewSelector(): Promise<void> {
    await expect(await this.findBySelector('connectionToProjectDialogViewSelector')).not.toBeDisplayed();
  }

  async projectSelectDialogSelectFirstView(optionTitle: string): Promise<void> {
    const $connectionToProjectDialogViewSelector = await this.findBySelector('connectionToProjectDialogViewSelector');
    await $connectionToProjectDialogViewSelector.waitForDisplayed();

    const muiSelect = new MuiSelectBlock(
      '.ConnectionsToProjectsWidget-Dialog .ConnectionsToProjectsWidget-ViewSelector .Form-Control'
    );
    await muiSelect.selectOptionByTitle(optionTitle);
  }
}

export const connectionsToProjectsWidgetBlock = new ConnectionsToProjectsWidgetBlock();
