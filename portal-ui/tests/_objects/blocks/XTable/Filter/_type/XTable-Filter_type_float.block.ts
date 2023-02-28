import { Block } from '../../../../Block';
import { xTable } from '../../XTable.block';

class XTableFilterTypeFloat extends Block {
  selectors = {
    container: '.XTable-Filter_type_float',
    filterInputLte: '.XTable-HeadCell .XTable-Filter .MuiTextField-root:first-child input',
    filterInputGte: '.XTable-HeadCell .XTable-Filter .MuiTextField-root:last-child input'
  };

  async setValue2(lte: string, gte: string) {
    const $filterInputLte = await this.$('filterInputLte');
    await $filterInputLte.setValue(lte);

    const $filterInputGte = await this.$('filterInputGte');
    await $filterInputGte.setValue(gte);

    await browser.pause(300);
  }

  async checkFilterableLteItems(lte: string) {
    const values = await xTable.getFirstColCellValues();

    expect(values.length).toEqual(4);
    values.forEach(val => {
      expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
    });
  }

  async checkFilterableGteItems2(gte: string) {
    const values = await xTable.getFirstColCellValues();

    expect(values.length).toEqual(5);
    values.forEach(val => {
      expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    });
  }

  async checkFilterableGteItems3(lte: string, gte: string) {
    const values = await xTable.getFirstColCellValues();

    expect(values.length).toEqual(5);
    values.forEach(val => {
      expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
      expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    });
  }
}

export const xTableFilterTypeFloat = new XTableFilterTypeFloat();
