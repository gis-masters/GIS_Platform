import { Block } from '../../../../Block';
import { hasClass } from '../../../../utils/hasClass';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

export class XTableFilterTypeStringBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_string',
    strictness: '.XTable-Filter_type_string .XTable-FilterStrictness'
  };

  async clear(): Promise<void> {
    const inputBlock = new MuiInputBlock(await this.$('container'));
    await inputBlock.clearValue();
  }

  async strictnessClick(): Promise<void> {
    const $filterInputStrictness = await this.$('strictness');
    await $filterInputStrictness.click();
    await browser.pause(300); // отрисовка фильтрации в таблице
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

  async isFilterActive(): Promise<boolean> {
    const $filterInputStrictness = await this.$('strictness');

    return hasClass($filterInputStrictness, 'XTable-FilterStrictness_filtered');
  }
}

export const xTableFilterTypeStringBlock = new XTableFilterTypeStringBlock();
