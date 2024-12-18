import { Block } from '../../../../Block';
import { xTableBlock } from '../../XTable.block';

class XTableFilterTypeDateTimeBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_dateTime',
    filterInputFirstDate: '.XTable-Filter_type_dateTime .MuiTextField-root:first-child input',
    filterInputSecondDate: '.XTable-Filter_type_dateTime .MuiTextField-root:last-child input'
  };

  async setValue2(firstDate: string, secondDate: string) {
    const $filterInputFirstDate = await this.$('filterInputFirstDate');
    await $filterInputFirstDate.setValue(firstDate);
    await browser.pause(300);

    const $filterInputSecondDate = await this.$('filterInputSecondDate');
    await $filterInputSecondDate.setValue(secondDate);

    await browser.pause(300);
  }

  async checkFilterableLteItems() {
    const values = await xTableBlock.getFirstColCellValues();
    await expect(values.length).toEqual(2);
    await expect(values).toEqual(['19.05.2019', '18.12.2021']);
  }

  async checkFilterableGteItems() {
    const values = await xTableBlock.getFirstColCellValues();
    await expect(values.length).toEqual(4);
    await expect(values).toEqual(['02.08.2013', '13.06.2016', '16.06.2017', '05.08.2017']);
  }

  async checkFilterableItems() {
    const values = await xTableBlock.getFirstColCellValues();
    await expect(values.length).toEqual(2);
    await expect(values).toEqual(['16.06.2017', '05.08.2017']);
  }
}

export const xTableFilterTypeDateTimeBlock = new XTableFilterTypeDateTimeBlock();
