import { assertString } from '../../../../../../src/app/utils/assertString';
import { Block } from '../../../../classes/Block';

export class XTableFilterTypeIdBlock extends Block {
  selectors = {
    root: '.XTable-Filter_type_id',
    input: '.XTable-Filter_type_id input'
  };

  async getValue(): Promise<string> {
    const $input = await this.findBySelector('input');

    return assertString(await $input.getValue(), 'XTableFilter.getValue');
  }

  async setValue(title: string): Promise<void> {
    const $input = await this.findBySelector('input');
    await $input.setValue(title);
  }
}

export const xTableFilterTypeIdBlock = new XTableFilterTypeIdBlock();
