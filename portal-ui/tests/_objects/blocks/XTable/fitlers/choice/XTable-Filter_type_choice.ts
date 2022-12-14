import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../../../Block';
import { xTable } from '../../XTable';

@binding()
class XTableFilterTypeChoice extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_choice');
  }

  get $filterInputChoice(): Promise<WebdriverIO.Element> {
    return $('.XTable-Filter_type_choice .MuiSelect-select');
  }

  get $popoverOverlay(): Promise<WebdriverIO.Element> {
    return $('.MuiPopover-root');
  }

  get $choiceFirstOptions(): Promise<WebdriverIO.Element> {
    return $('.XTable-ChoiceFilterPopover ul li:first-child input');
  }

  get $choiceSecondOptions(): Promise<WebdriverIO.Element> {
    return $('.XTable-ChoiceFilterPopover ul li:nth-child(3) input');
  }

  @when(/^в таблице xtable я выбираю в поле фильтра типа choice первую опцию$/)
  async setValue() {
    const $filterInputChoice = await this.$filterInputChoice;
    await $filterInputChoice.click();
    await browser.pause(300);

    const $choiceFirstOptions = await this.$choiceFirstOptions;
    await $choiceFirstOptions.click();

    await browser.pause(300);
  }

  @when(/^в таблице xtable я выбираю в поле фильтра типа choice вторую опцию$/)
  async setValue2() {
    const $filterInputChoice = await this.$filterInputChoice;
    await $filterInputChoice.click();
    await browser.pause(300);

    const $choiceSecondOptions = await this.$choiceSecondOptions;
    await $choiceSecondOptions.click();

    await browser.pause(300);
  }

  @when(/^в таблице xtable я повторно выбираю в поле фильтра типа choice вторую опцию$/)
  async setValue3() {
    const $choiceSecondOptions = await this.$choiceSecondOptions;
    await $choiceSecondOptions.click();

    await browser.pause(300);
  }

  @then(
    /^в таблице xtable с фильтром типа choice отображаются только элементы, значение которых подходит под выбранную опцию$/
  )
  async checkFilterableOptionItems() {
    const $popoverOverlay = await this.$popoverOverlay;
    await $popoverOverlay.click();
    await browser.pause(300);

    const values = await xTable.getFirstColCellValues();

    expect(values.length).toEqual(1);
    expect(values).toEqual(['Дерево']);
  }

  @then(/^в таблице xtable с фильтром типа choice отображаются все элементы$/)
  async checkFilterableItems() {
    const $popoverOverlay = await this.$popoverOverlay;
    await $popoverOverlay.click();
    await browser.pause(300);

    const values = await xTable.getFirstColCellValues();
    expect(values.length).toEqual(6);
    expect(values).toEqual(['Дерево', 'Железо', 'Стекло', 'Железо', 'Стекло', 'Стекло']);
  }
}

export const xTableFilterTypeChoice = new XTableFilterTypeChoice();
