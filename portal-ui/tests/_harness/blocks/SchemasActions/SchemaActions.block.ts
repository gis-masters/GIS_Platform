import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../classes/Block';

class SchemaActionsBlock extends Block {
  selectors = {
    root: '.SchemaActions',
    editBtn: '.SchemaActions-Edit'
  };

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.findBySelector('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
    await sleep(300); // ждем анимации открытия диалога
  }
}

export const schemaActionsBlock = new SchemaActionsBlock();
