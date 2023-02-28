import { Block } from '../../../../Block';
import { xTable } from '../../XTable.block';

class XTableFilterTypeBool extends Block {
  selectors = {
    container: '.XTable-Filter_type_bool',
    filterButtonTrue: '.XTable-Filter_type_bool button:first-child',
    filterButtonFalse: '.XTable-Filter_type_bool button:last-child'
  };

  async setValueTrue() {
    const $filterButtonTrue = await this.$('filterButtonTrue');
    await $filterButtonTrue.click();

    await browser.pause(300);
  }

  async setValueFalse() {
    const $filterButtonFalse = await this.$('filterButtonFalse');
    await $filterButtonFalse.click();

    await browser.pause(300);
  }

  async checkFilterableTrueItems() {
    const values = await xTable.getSecondColValues();
    expect(values.length).toEqual(4);
    expect(values).toEqual(['да', 'да', 'да', 'да']);
  }

  async checkFilterableFalseItems() {
    const values = await xTable.getSecondColValues();
    expect(values.length).toEqual(2);
    expect(values).toEqual(['нет', 'нет']);
  }
}

export const xTableFilterTypeBool = new XTableFilterTypeBool();
