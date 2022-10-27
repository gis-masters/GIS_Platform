import { Block } from '../../../Block';

export class XTableFilterPanel extends Block {
  selectors = {
    clearAllFiltersChip: '.XTable-FilterPanel .XTable-FilterPanelItem:first-child',
    firstFilterChip: '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2)',
    firstFilterChipTitle:
      '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2) .XTable-FilterPanelItemContent span:first-child',
    firstFilterChipValue:
      '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2) .XTable-FilterPanelItemContent span:last-child',
    secondFilterChipValue:
      '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(3) .XTable-FilterPanelItemContent span:last-child',
    firstFilterChipClear: '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2) .MuiSvgIcon-root',
    allFiltersChipClear: '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(1) .MuiSvgIcon-root',
    inputTypeString: '.XTable-Filter_type_string .MuiInputBase-input',
    firstInputTypeFloat: '.XTable-Filter_type_float .MuiTextField-root:first-child .MuiInputBase-input',
    secondInputTypeFloat: '.XTable-Filter_type_float .MuiTextField-root:last-child .MuiInputBase-input',
    firstInputTypeDateTime: '.XTable-Filter_type_dateTime .MuiTextField-root:first-child .MuiInputBase-input',
    secondInputTypeDateTime: '.XTable-Filter_type_dateTime .MuiTextField-root:last-child .MuiInputBase-input',
    firstBoolBtn: '.XTable-Filter_type_bool button:first-child',
    secondBoolBtn: '.XTable-Filter_type_bool button:last-child',
    strictness: '.XTable-FilterStrictness',
    firstColCellContent: '.XTable-Cell:first-child .XTable-CellContent',
    cellValue: '.Highlight'
  };

  async isFiltersPanelEmpty(): Promise<boolean> {
    const $containerContent = await this.getElement('clearAllFiltersChip');

    return !$containerContent;
  }

  async isFilterShow(): Promise<boolean> {
    const $firstFilterChip = await this.getElement('firstFilterChip');

    return !!$firstFilterChip;
  }

  async setStringFieldValue(value: string): Promise<void> {
    const $input = await this.getElement('inputTypeString');
    await $input.setValue(value);
    await this.browser.pause(200);
  }

  async setFloatFieldValue(value1: number, value2: number): Promise<void> {
    const $firstInput = await this.getElement('firstInputTypeFloat');
    const $secondInput = await this.getElement('secondInputTypeFloat');
    await $firstInput.setValue(value1);
    await this.browser.pause(400); // input focus animation
    await $secondInput.setValue(value2);
    await this.browser.pause(400); // input focus animation
  }

  async setDateTimeFieldValue(value1: number, value2: number): Promise<void> {
    const $firstInput = await this.getElement('firstInputTypeDateTime');
    await $firstInput.setValue(value1);
    await this.browser.pause(400); // input focus animation

    const $secondInput = await this.getElement('secondInputTypeDateTime');
    await $secondInput.setValue(value2);
    await this.browser.pause(400); // input focus animation
  }

  async setBoolFieldValue(bool: boolean): Promise<void> {
    await this.browser.pause(1400); // loader
    if (bool) {
      const $firstInput = await this.getElement('firstBoolBtn');
      await $firstInput.click();
      await this.browser.pause(400); // input focus animation
    } else {
      const $secondInput = await this.getElement('secondBoolBtn');
      await $secondInput.click();
      await this.browser.pause(400); // input focus animation
    }
  }

  async toggleStrictness(): Promise<void> {
    const $strictness = await this.getElement('strictness');
    await $strictness.click();
    await this.browser.pause(400); // button animation
  }

  async clearFirstFilter(): Promise<void> {
    const $clear = await this.getElement('firstFilterChipClear');
    $clear.click();
    await this.browser.pause(200);
  }

  async clearAllFilter(): Promise<void> {
    const $clear = await this.getElement('allFiltersChipClear');
    $clear.click();
    await this.browser.pause(200);
  }

  async getFilterTitle(): Promise<string> {
    const $title = await this.getElement('firstFilterChipTitle');

    return await $title.getText();
  }

  async getFirstFilterValue(): Promise<string> {
    const $title = await this.getElement('firstFilterChipValue');

    return await $title.getText();
  }

  async getSecondFilterValue(): Promise<string> {
    const $title = await this.getElement('secondFilterChipValue');

    return await $title.getText();
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
