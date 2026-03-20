import { Block } from '../../../../classes/Block';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

export class XTableFilterTypeDocumentBlock extends Block {
  selectors = {
    root: '.XTable-Filter_type_document',
    input: '.XTable-Filter_type_document input'
  };

  async clear(): Promise<void> {
    const inputBlock = new MuiInputBlock(await this.findBySelector('root'));
    await inputBlock.clearValue();
  }

  async setValue(title: string): Promise<void> {
    const inputBlock = new MuiInputBlock(await this.findBySelector('root'));
    await inputBlock.setValue(title);
    await browser.pause(300); // отрисовка фильтрации в таблице
  }

  async getValue(): Promise<string> {
    const inputBlock = new MuiInputBlock(await this.findBySelector('root'));

    return inputBlock.getValue();
  }
}

export const xTableFilterTypeDocumentBlock = new XTableFilterTypeDocumentBlock();
