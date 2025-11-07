import { Block } from '../../../../Block';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

export class XTableFilterTypeFiasBlock extends Block {
  selectors = {
    root: '.XTable-Filter_type_fias'
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
}

export const xTableFilterTypeFiasBlock = new XTableFilterTypeFiasBlock();
