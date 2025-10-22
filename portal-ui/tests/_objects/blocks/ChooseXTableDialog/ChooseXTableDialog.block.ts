import { Block } from '../../Block';
import { XTableBlock } from '../XTable/XTable.block';

export class ChooseXTableDialogBlock extends Block {
  selectors = {
    container: '.ChooseXTableDialog',
    submit: '.ChooseXTableDialog-Submit'
  };

  async clickSubmitButton(): Promise<void> {
    const $submitBtn = await this.findBySelector('submit');
    await $submitBtn.waitForClickable();
    await $submitBtn.click();
  }

  async getXTable(): Promise<XTableBlock> {
    return new XTableBlock(undefined, await this.findBySelector('container'));
  }
}

export const chooseXTableDialogBlock = new ChooseXTableDialogBlock();
