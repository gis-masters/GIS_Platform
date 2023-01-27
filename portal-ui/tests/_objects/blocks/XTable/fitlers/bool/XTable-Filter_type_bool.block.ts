import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../../Block';
import { xTable } from '../../XTable.block';

@binding()
class XTableFilterTypeBool extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_bool');
  }

  get $filterButtonTrue(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_bool button:first-child');
  }

  get $filterButtonFalse(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_bool button:last-child');
  }

  @when(/^в таблице xtable c фильтром типа bool я нажимаю да$/)
  async setValueTrue() {
    const $filterButtonTrue = await this.$filterButtonTrue;
    await $filterButtonTrue.click();

    await browser.pause(300);
  }

  @when(/^в таблице xtable c фильтром типа bool я нажимаю нет$/)
  async setValueFalse() {
    const $filterButtonFalse = await this.$filterButtonFalse;
    await $filterButtonFalse.click();

    await browser.pause(300);
  }

  @then(
    /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `да`$/
  )
  async checkFilterableTrueItems() {
    const values = await xTable.getSecondColValues();
    expect(values.length).toEqual(4);
    expect(values).toEqual(['да', 'да', 'да', 'да']);
  }

  @then(
    /^в таблице xtable с фильтром типа bool отображаются только элементы, значение которых подходит под введённое ограничение `нет`$/
  )
  async checkFilterableFalseItems() {
    const values = await xTable.getSecondColValues();
    expect(values.length).toEqual(2);
    expect(values).toEqual(['нет', 'нет']);
  }
}

export const xTableFilterTypeBool = new XTableFilterTypeBool();
