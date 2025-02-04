import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';

class UtilityDialogBlock extends Block {
  selectors = {
    container: '.UtilityDialog',
    confirm: '.UtilityDialog_type_konfirmieren',
    content: '.UtilityDialog-Content'
  };

  async clickButtonByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    const dialogBlock = new DialogBlock(null, $container);

    await dialogBlock.clickButtonByTitle(title);
  }

  async getConfirmDialog(): Promise<WebdriverIO.Element> {
    return await this.$('confirm');
  }

  async getTextFromDialog(): Promise<string> {
    const $confirm = await this.getConfirmDialog();
    const $content = await $confirm.$(this.selectors.content);

    return await $content.getText();
  }
}

export const utilityDialogBlock = new UtilityDialogBlock();
