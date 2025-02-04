import { Block } from '../../../../Block';
import { hasClass } from '../../../../utils/hasClass';
import { xTableBlock } from '../../XTable.block';

class XTableFilterTypeBoolBlock extends Block {
  selected = 'Mui-selected';

  selectors = {
    container: '.XTable-Filter_type_bool',
    filterButtonTrue: '.XTable-Filter_type_bool button:first-child',
    filterButtonFalse: '.XTable-Filter_type_bool button:last-child'
  };

  async setValueTrue(title: string) {
    const $headCell = await xTableBlock.getHeadCell(title);
    const $filterButtonTrue = await $headCell.$('button:first-child');
    const isSelected = await hasClass($filterButtonTrue, this.selected);

    if (!isSelected) {
      await $filterButtonTrue.click();
    }
  }

  async setValueFalse(title: string) {
    const $headCell = await xTableBlock.getHeadCell(title);
    const $filterButtonFalse = await $headCell.$('button:last-child');
    const isSelected = await hasClass($filterButtonFalse, this.selected);

    if (!isSelected) {
      await $filterButtonFalse.click();
    }
  }

  async clearFilterValue(title: string) {
    const $headCell = await xTableBlock.getHeadCell(title);
    const $filterButtonFalse = await $headCell.$('button:last-child');
    let isSelected = await hasClass($filterButtonFalse, this.selected);

    if (isSelected) {
      await $filterButtonFalse.click();
    }

    const $filterButtonTrue = await $headCell.$('button:first-child');
    isSelected = await hasClass($filterButtonTrue, this.selected);

    if (isSelected) {
      await $filterButtonTrue.click();
    }
  }

  async checkFilterableTrueItems() {
    const values = await xTableBlock.getSecondColValues();
    await expect(values.length).toEqual(4);
    await expect(values).toEqual(['да', 'да', 'да', 'да']);
  }

  async checkFilterableFalseItems() {
    const values = await xTableBlock.getSecondColValues();
    await expect(values.length).toEqual(2);
    await expect(values).toEqual(['нет', 'нет']);
  }
}

export const xTableFilterTypeBoolBlock = new XTableFilterTypeBoolBlock();
