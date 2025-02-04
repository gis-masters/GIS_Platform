import { Block } from '../../../../Block';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

export class XTableFilterTypeDocumentBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_document',
    input: '.XTable-Filter_type_document input'
  };

  async clear(): Promise<void> {
    const inputBlock = new MuiInputBlock(await this.$('container'));
    await inputBlock.clearValue();
  }

  async setValue(title: string): Promise<void> {
    const inputBlock = new MuiInputBlock(await this.$('container'));
    await inputBlock.setValue(title);
    await browser.pause(300); // отрисовка фильтрации в таблице
  }

  async getValue(): Promise<string> {
    const inputBlock = new MuiInputBlock(await this.$('container'));

    return inputBlock.getValue();
  }
}

export const xTableFilterTypeDocumentBlock = new XTableFilterTypeDocumentBlock();
