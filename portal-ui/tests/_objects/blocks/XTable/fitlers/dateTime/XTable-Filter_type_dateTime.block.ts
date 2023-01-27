import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../../Block';
import { xTable } from '../../XTable.block';

@binding()
class XTableFilterTypeDateTime extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_dateTime');
  }

  get $filterInputFirstDate(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_dateTime .MuiTextField-root:first-child input');
  }

  get $filterInputSecondDate(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_dateTime .MuiTextField-root:last-child input');
  }

  @when(/^в таблице xtable я ввожу в поле фильтра типа dateTime "(.*)" и "(.*)"$/)
  async setValue2(firstDate: string, secondDate: string) {
    const $filterInputFirstDate = await this.$filterInputFirstDate;
    await $filterInputFirstDate.setValue(firstDate);
    await browser.pause(300);

    const $filterInputSecondDate = await this.$filterInputSecondDate;
    await $filterInputSecondDate.setValue(secondDate);

    await browser.pause(300);
  }

  @then(
    /^в таблице xtable с фильтром типа datetime отображаются только элементы, значение которых подходит под введённое ограничение `от` `10.10.2017`$/
  )
  async checkFilterableLteItems() {
    const values = await xTable.getFirstColCellValues();
    expect(values.length).toEqual(2);
    expect(values).toEqual(['18.12.2021', '19.05.2019']);
  }

  @then(
    /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под введённое ограничение `до` `10.10.2017`$/
  )
  async checkFilterableGteItems() {
    const values = await xTable.getFirstColCellValues();
    expect(values.length).toEqual(4);
    expect(values).toEqual(['05.08.2017', '02.08.2013', '13.06.2016', '16.06.2017']);
  }

  @then(
    /^в таблице xtable с фильтром типа dateTime отображаются только элементы, значение которых подходит под оба введённых ограничения `от` `10.10.2016` `до` `10.10.2017`$/
  )
  async checkFilterableItems() {
    const values = await xTable.getFirstColCellValues();
    expect(values.length).toEqual(2);
    expect(values).toEqual(['05.08.2017', '16.06.2017']);
  }
}

export const xTableFilterTypeDateTime = new XTableFilterTypeDateTime();
