import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';

class UtilityDialogBlock extends Block {
  selectors = {
    root: '.UtilityDialog',
    confirm: '.UtilityDialog_type_konfirmieren',
    content: '.UtilityDialog-Content'
  };

  async clickButtonByTitle(title: string): Promise<void> {
    const $root = await this.findBySelector('root');
    const dialogBlock = new DialogBlock(null, $root);

    await dialogBlock.clickActionButton(title);
  }

  async getConfirmDialog(): Promise<WebdriverIO.Element> {
    return await this.findBySelector('confirm');
  }

  async getTextFromDialog(): Promise<string> {
    const $confirm = await this.getConfirmDialog();
    const $content = await $confirm.$(this.selectors.content).getElement();

    return await $content.getText();
  }
}

export const utilityDialogBlock = new UtilityDialogBlock();
