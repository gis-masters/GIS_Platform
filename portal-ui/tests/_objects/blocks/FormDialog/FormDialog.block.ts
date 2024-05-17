import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { FormBlock } from '../Form/Form.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class FormDialogBlock extends Block {
  selectors = {
    container: '.FormDialog'
  };

  async changeFieldValueByFieldName(fieldName: string, fieldValue: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(fieldName);

    if (!$field) {
      throw new Error(`Не найден элемент ${fieldName}`);
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(fieldValue);
  }

  async clickButtonByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    const dialogBlock = new DialogBlock(null, $container);

    await dialogBlock.clickButtonByTitle(title);
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
