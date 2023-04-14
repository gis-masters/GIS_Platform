import { Block } from '../../../../Block';
import { hasClass } from '../../../../utils/hasClass';
import { MuiInputBlock } from '../../../MuiInput/MuiInput.block';

class XTableFilterTypeStringBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_string',
    filterInput: '.XTable-Filter_type_string input',
    filterInputStrictness: '.XTable-Filter_type_string .XTable-FilterStrictness'
  };

  async clear(): Promise<void> {
    const inputBlock = new MuiInputBlock(this.selectors.container);
    await inputBlock.clearInputValue();
  }

  async filterClick(): Promise<void> {
    const $filterInputStrictness = await this.$('filterInputStrictness');
    await $filterInputStrictness.click();
    await browser.pause(300); // ждем анимацию фильтрации в таблице
  }

  async setValue(title: string) {
    const $filterInput = await this.$('filterInput');
    await $filterInput.setValue(title);
    await browser.pause(300); // ждем анимацию фильтрации в таблице
  }

  async getValue(): Promise<string> {
    const $filterInput = await this.$('filterInput');

    return $filterInput.getValue();
  }

  async isFilterActive(): Promise<boolean> {
    const $filterInputStrictness = await this.$('filterInputStrictness');

    return hasClass($filterInputStrictness, 'XTable-FilterStrictness_filtered');
  }
}

export const xTableFilterTypeStringBlock = new XTableFilterTypeStringBlock();
