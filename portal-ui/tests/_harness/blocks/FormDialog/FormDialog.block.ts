import path from 'node:path';

import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { FormBlock } from '../Form/Form.block';

class FormDialogBlock extends Block {
  selectors = {
    root: '.FormDialog'
  };

  async getStringValue(fieldName: string): Promise<string> {
    const formBlock = new FormBlock(this.selectors.root);

    return await formBlock.getStringValue(fieldName);
  }

  async setStringValue(fieldName: string, fieldValue: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.root);
    await formBlock.replaceStringValue(fieldName, fieldValue);
  }

  async clickActionButton(title: string): Promise<void> {
    const $root = await this.findBySelector('root');
    const dialogBlock = new DialogBlock(null, $root);

    await dialogBlock.clickActionButton(title);
  }

  async setFileFromTestFiles(fieldLabel: string, fileName: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.root);
    const $field = await formBlock.getField(fieldLabel);
    const $input = await $field.$('.FileInput-Input').getElement();
    const absPath = path.join(process.cwd(), 'tests', '_files', fileName);
    const remotePath = await browser.uploadFile(absPath);
    await $input.setValue(remotePath);
  }

  async waitForNotHidden(): Promise<void> {
    try {
      await this.waitForHidden();
    } catch {
      return;
    }

    throw new Error('Диалоговое окно не должно было закрыться');
  }
}

export const formDialogBlock = new FormDialogBlock();
