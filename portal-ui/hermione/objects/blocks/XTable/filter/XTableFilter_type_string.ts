import { Block } from '../../../Block';

export class XTableFilterTypeString extends Block {
  selectors = {
    container: '.XTable-Filter_type_string',
    input: '.XTable-Filter_type_string .MuiInputBase-input',
    strictness: '.XTable-FilterStrictness',
    firstColCellContent: '.XTable-Cell:first-child .XTable-CellContent',
    cellValue: '.Highlight'
  };

  private filteredClassName = 'XTable-FilterStrictness_filtered';
  private strictClassName = 'XTable-FilterStrictness_strict';

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется строковый фильтр' });
  }

  async isFilterActive(): Promise<boolean> {
    const $strictness = await this.getElement('strictness');
    const className = await $strictness.getAttribute('class');

    return className.split(' ').includes(this.filteredClassName);
  }

  async isStrict(): Promise<boolean> {
    const $strictness = await this.getElement('strictness');
    const className = await $strictness.getAttribute('class');

    return className.split(' ').includes(this.strictClassName);
  }

  async setValue(value: string): Promise<void> {
    const $input = await this.getElement('input');
    await $input.setValue(value);
    await this.browser.pause(400); // input focus animation
  }

  async toggleStrictness(): Promise<void> {
    const $strictness = await this.getElement('strictness');
    await $strictness.click();
    await this.browser.pause(400); // button animation
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }

  async getFirstColValues(): Promise<string[]> {
    const $$contents = await this.getElements('firstColCellContent');

    return Promise.all(
      $$contents.map(async $content => {
        const $cellValue = await this.getSubElement($content, 'cellValue');

        return await $cellValue.getText();
      })
    );
  }
}
