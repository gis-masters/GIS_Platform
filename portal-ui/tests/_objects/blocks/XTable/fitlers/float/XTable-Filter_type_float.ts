import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../../Block';
import { xTable } from '../../XTable';

@binding()
class XTableFilterTypeFloat extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_float');
  }

  get $filterInputLte(): Promise<WebdriverIO.Element> {
    return $('.XTable-HeadCell .XTable-Filter .MuiTextField-root:first-child input');
  }

  get $filterInputGte(): Promise<WebdriverIO.Element> {
    return $('.XTable-HeadCell .XTable-Filter .MuiTextField-root:last-child input');
  }

  @when(/^в таблице xtable я ввожу в поле фильтра типа float "(.*)" и "(.*)"$/)
  async setValue2(lte: string, gte: string) {
    const $filterInputLte = await this.$filterInputLte;
    await $filterInputLte.setValue(lte);

    const $filterInputGte = await this.$filterInputGte;
    await $filterInputGte.setValue(gte);

    await browser.pause(300);
  }

  @then(
    /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `от` "(.*)"$/
  )
  async checkFilterableLteItems(lte: string) {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(4);
    values.forEach(val => {
      expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
    });
  }

  @then(
    /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под введённое ограничение `до` "(.*)"$/
  )
  async checkFilterableGteItems2(gte: string) {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(5);
    values.forEach(val => {
      expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    });
  }

  @then(
    /^в таблице xtable с фильтром типа float отображаются только элементы, значение которых подходит под оба введённых ограничения `от` "(.*)" `до` "(.*)"$/
  )
  async checkFilterableGteItems3(lte: string, gte: string) {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(5);
    values.forEach(val => {
      expect(Number(val)).toBeGreaterThanOrEqual(Number(lte));
      expect(Number(val)).toBeLessThanOrEqual(Number(gte));
    });
  }
}

export const xTableFilterTypeFloat = new XTableFilterTypeFloat();
