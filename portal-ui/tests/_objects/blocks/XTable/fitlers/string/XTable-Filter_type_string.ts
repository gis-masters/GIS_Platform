import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../../Block';
import { xTable } from '../../XTable';

@binding()
class XTableFilterTypeString extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_string');
  }

  get $filterInput(): Promise<WebdriverIO.Element> {
    return $('.XTable-HeadCell input');
  }

  get $filterInputStrictness(): Promise<WebdriverIO.Element> {
    return $('.XTable-HeadCell .XTable-FilterStrictness');
  }

  @when(/^в таблице xtable я очищаю поле фильтра типа string$/)
  async clean(): Promise<void> {
    const $filterInput = await this.$filterInput;
    await $filterInput.setValue('');
    await browser.pause(300);
  }

  @when(/^в таблице xtable я переключаю режим фильтрации в поле фильтра типа string$/)
  async filterClick(): Promise<void> {
    const $filterInputStrictness = await this.$filterInputStrictness;
    await $filterInputStrictness.click();
    await browser.pause(300);
  }

  @when(/^в таблице xtable я ввожу в поле фильтра типа string "(.*)"$/)
  async setText(title: string) {
    const $filterInput = await this.$filterInput;
    await $filterInput.setValue(title);
    await browser.pause(300);
  }

  @then(/^в таблице xtable кнопка переключения режимов фильтра типа string не имеет жёлтой подсветки$/)
  async checkInputStrict() {
    const elem = await this.$filterInputStrictness;
    const classes = await elem.getAttribute('class');

    expect(!classes.split(' ').includes('.XTable-FilterStrictness_filtered'));
  }

  @then(/^в таблице xtable кнопка переключения режимов фильтра типа string имеет жёлтую подсветку$/)
  async checkInputNotStrict() {
    const elem = await this.$filterInputStrictness;
    const classes = await elem.getAttribute('class');

    expect(classes.split(' ').includes('.XTable-FilterStrictness_filtered'));
  }

  @then(/^в таблице xtable с фильтром типа string отображаются только элементы, содержащие введённую подстроку `Тр`$/)
  async checkNotStrictFilterableItems() {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(2);
    expect(values).toEqual(['Трон', 'Трюмо']);
  }

  @then(/^в таблице xtable с фильтром типа string отображаются только элементы, значение которых совпадает c `Трон`$/)
  async checkStrictFilterableItems() {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(1);
    expect(values).toEqual(['Трон']);
  }

  @then(
    /^в таблице xtable с фильтром типа string отображаются только элементы, значение которых начинается с введённой строки `Тр%`$/
  )
  // eslint-disable-next-line sonarjs/no-identical-functions
  async checkStrictFilterableItems2() {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(2);
    expect(values).toEqual(['Трон', 'Трюмо']);
  }

  @then(
    /^в таблице xtable с фильтром типа string отображаются только элементы, значение которых подходят под введённый шаблон$/
  )
  async checkStrictFilterableItems3() {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(2);
    expect(values).toEqual(['Шкаф платяной', 'Шкаф стенной']);
  }

  @then(
    /^в таблице xtable с фильтром типа string отображаются только элементы, значение которых соответствует введённому шаблону$/
  )
  // eslint-disable-next-line sonarjs/no-identical-functions
  async checkStrictFilterableItems4() {
    const values = await xTable.getFirstColCellHighlightedValues();

    expect(values.length).toEqual(1);
    expect(values).toEqual(['Трон']);
  }

  @then(/^в таблице xtable фильтр типа string переходит в нестрогий режим с пустым полем$/)
  async changeFilterStrictness() {
    const elem = await this.$filterInputStrictness;
    const classes = await elem.getAttribute('class');

    expect(!classes.split(' ').includes('.XTable-FilterStrictness_strict'));
  }
}

export const xTableFilterTypeString = new XTableFilterTypeString();
