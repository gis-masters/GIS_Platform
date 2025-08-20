import { Block } from '../../../../Block';
import { xTableBlock } from '../../XTable.block';

class XTableFilterTypeFloatBlock extends Block {
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
    const values = await xTableBlock.getFirstColCellValues();

    await expect(values.length).toEqual(4);

    for (const val of values) {
      await expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
    }
  }

  async checkFilterableGteItems2(gte: string) {
    const values = await xTableBlock.getFirstColCellValues();

    await expect(values.length).toEqual(5);

    for (const val of values) {
      await expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    }
  }

  async checkFilterableGteItems3(lte: string, gte: string) {
    const values = await xTableBlock.getFirstColCellValues();

    await expect(values.length).toEqual(5);

    for (const val of values) {
      await expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
      await expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    }
  }
}

export const xTableFilterTypeFloatBlock = new XTableFilterTypeFloatBlock();
