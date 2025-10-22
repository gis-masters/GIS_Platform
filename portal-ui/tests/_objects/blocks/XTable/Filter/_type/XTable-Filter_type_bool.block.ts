import { sleep } from '../../../../../../src/app/services/util/sleep';
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
    const $filterButtonTrue = await $headCell.$('button:first-child').getElement();
    const isSelected = await hasClass($filterButtonTrue, this.selected);

    if (!isSelected) {
      await $filterButtonTrue.click();
      await sleep(400); // button focus animation
    }
  }

  async setValueFalse(title: string) {
    const $headCell = await xTableBlock.getHeadCell(title);
    const $filterButtonFalse = await $headCell.$('button:last-child').getElement();
    const isSelected = await hasClass($filterButtonFalse, this.selected);

    if (!isSelected) {
      await $filterButtonFalse.click();
      await sleep(400); // button focus animation
    }
  }

  async clearFilterValue(title: string) {
    const $headCell = await xTableBlock.getHeadCell(title);
    const $filterButtonFalse = await $headCell.$('button:last-child').getElement();
    let isSelected = await hasClass($filterButtonFalse, this.selected);

    if (isSelected) {
      await $filterButtonFalse.click();
    }

    const $filterButtonTrue = await $headCell.$('button:first-child').getElement();
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
