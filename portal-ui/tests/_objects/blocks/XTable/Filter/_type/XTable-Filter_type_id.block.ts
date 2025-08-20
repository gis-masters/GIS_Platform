import { Block } from '../../../../Block';

export class XTableFilterTypeIdBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_id',
    input: '.XTable-Filter_type_id input'
  };

  async getValue(): Promise<string> {
    const $input = await this.$('input');

    return $input.getValue();
  }

  async setValue(title: string): Promise<void> {
    const $input = await this.$('input');
    await $input.setValue(title);
  }
}

export const xTableFilterTypeIdBlock = new XTableFilterTypeIdBlock();
