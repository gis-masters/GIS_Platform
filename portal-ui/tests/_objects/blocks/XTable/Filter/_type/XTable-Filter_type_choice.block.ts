import { Block } from '../../../../Block';
import { xTableBlock } from '../../XTable.block';

class XTableFilterTypeChoiceBlock extends Block {
  selectors = {
    container: '.XTable-Filter_type_choice',
    filterInputChoice: '.XTable-Filter_type_choice .MuiSelect-select',
    popoverOverlay: '.MuiPopover-root',
    choiceFirstOptions: '.XTable-ChoiceFilterPopover ul li:first-child input',
    choiceSecondOptions: '.XTable-ChoiceFilterPopover ul li:nth-child(3) input'
  };

  async setValue() {
    const $filterInputChoice = await this.$('filterInputChoice');
    await $filterInputChoice.click();
    await browser.pause(300);

    const $choiceFirstOptions = await this.$('choiceFirstOptions');
    await $choiceFirstOptions.click();

    await browser.pause(300);
  }

  async setValue2() {
    const $filterInputChoice = await this.$('filterInputChoice');
    await $filterInputChoice.click();
    await browser.pause(300);

    const $choiceSecondOptions = await this.$('choiceSecondOptions');
    await $choiceSecondOptions.click();

    await browser.pause(300);
  }

  async setValue3() {
    const $choiceSecondOptions = await this.$('choiceSecondOptions');
    await $choiceSecondOptions.click();

    await browser.pause(300);
  }

  async checkFilterableOptionItems() {
    const $popoverOverlay = await this.$('popoverOverlay');
    await $popoverOverlay.click();
    await browser.pause(300);

    const values = await xTableBlock.getFirstColCellValues();

    await expect(values.length).toEqual(1);
    await expect(values).toEqual(['Дерево']);
  }

  async checkFilterableItems() {
    const $popoverOverlay = await this.$('popoverOverlay');
    await $popoverOverlay.click();
    await browser.pause(300);

    const values = await xTableBlock.getFirstColCellValues();
    await expect(values.length).toEqual(6);
    await expect(values).toEqual(['Стекло', 'Стекло', 'Стекло', 'Железо', 'Железо', 'Дерево']);
  }
}

export const xTableFilterTypeChoiceBlock = new XTableFilterTypeChoiceBlock();
