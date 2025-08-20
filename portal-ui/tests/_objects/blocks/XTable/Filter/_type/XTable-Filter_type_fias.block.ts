import { Block } from '../../../../Block';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

export class XTableFilterTypeFiasBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_fias'
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
}

export const xTableFilterTypeFiasBlock = new XTableFilterTypeFiasBlock();
