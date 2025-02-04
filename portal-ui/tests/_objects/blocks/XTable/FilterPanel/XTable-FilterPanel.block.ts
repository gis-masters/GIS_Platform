import { Block } from '../../../Block';

class XTableFilterPanelBlock extends Block {
  selectors = {
    container: '.XTable-FilterPanel',
    item: '.XTable-FilterPanelItem',
    clearAll: '.XTable-FilterPanelItem_clearAll',
    itemTitle: '.XTable-FilterPanelItemContentPart:first-child',
    itemValue: '.XTable-FilterPanelItemContentPart_value',
    itemClear: '.XTable-FilterPanelItemClear',

    firstFilterChip: '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2)',
    secondFilterChipValue:
      '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(3) .XTable-FilterPanelItemContent span:last-child',
    firstFilterChipClear: '.XTable-FilterPanel .XTable-FilterPanelItem:nth-child(2) .MuiSvgIcon-root',
    inputTypeString: '.XTable-Filter_type_string .MuiInputBase-input',
    inputTypeDocument: '.XTable-Filter_type_document .MuiInputBase-input',
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

  async isEmpty(): Promise<boolean> {
    const $$items = await this.$$('item');

    return !$$items.length;
  }

  async hasClearAll(): Promise<boolean> {
    const $clearAll = await this.$('clearAll');

    return await $clearAll.isExisting();
  }

  async hasItem(title: string, value?: string): Promise<boolean> {
    let $item: WebdriverIO.Element;

    try {
      $item = await this.getItem(title);
    } catch {
      return false;
    }

    if (value === undefined || value === null) {
      return true;
    }

    const $itemValue = await $item.$(this.selectors.itemValue);

    return (await $itemValue.getText()) === value;
  }

  async clickClearAll(): Promise<void> {
    const $clearAll = await this.$('clearAll');
    await $clearAll.click();
  }

  async clearItem(title: string): Promise<void> {
    const $item = await this.getItem(title);
    const $itemClear = await $item.$(this.selectors.itemClear);
    await $itemClear.click();
  }

  private async getItem(title: string): Promise<WebdriverIO.Element> {
    const $$items = await this.$$('item');

    for (const $item of $$items) {
      const $itemTitle = await $item.$(this.selectors.itemTitle);

      if (!(await $itemTitle.isExisting())) {
        continue;
      }

      const itemTitle = await $itemTitle.getText();

      if (itemTitle === `${title}:`) {
        return $item;
      }
    }

    throw new Error(`Элемент панели фильтров "${title}" не найден`);
  }

  /* ниже жопа */

  async setStringFieldValue(value: string): Promise<void> {
    const $input = await this.$('inputTypeString');
    await $input.setValue(value);
    await browser.pause(200);
  }

  async setDocumentFieldValue(value: string): Promise<void> {
    const $input = await this.$('inputTypeDocument');
    await $input.setValue(value);
    await browser.pause(300); //  input animation
  }

  async setFloatFieldValue(value1: number, value2: number): Promise<void> {
    const $firstInput = await this.$('firstInputTypeFloat');
    const $secondInput = await this.$('secondInputTypeFloat');
    await $firstInput.setValue(value1);
    await browser.pause(400); // input focus animation
    await $secondInput.setValue(value2);
    await browser.pause(400); // input focus animation
  }

  async setDateTimeFieldValue(value1: number, value2: number): Promise<void> {
    const $firstInput = await this.$('firstInputTypeDateTime');
    await $firstInput.setValue(value1);
    await browser.pause(400); // input focus animation

    const $secondInput = await this.$('secondInputTypeDateTime');
    await $secondInput.setValue(value2);
    await browser.pause(400); // input focus animation
  }

  async setBoolFieldValue(bool: boolean): Promise<void> {
    if (bool) {
      const $firstInput = await this.$('firstBoolBtn');
      await $firstInput.click();
      await browser.pause(400); // input focus animation
    } else {
      const $secondInput = await this.$('secondBoolBtn');
      await $secondInput.click();
      await browser.pause(400); // input focus animation
    }
  }

  async toggleStrictness(): Promise<void> {
    const $strictness = await this.$('strictness');
    await $strictness.click();
    await browser.pause(300); //  input animation
  }

  async clearFirstFilter(): Promise<void> {
    const $clear = await this.$('firstFilterChipClear');
    await $clear.click();
  }

  async getSecondFilterValue(): Promise<string> {
    const $title = await this.$('secondFilterChipValue');

    return await $title.getText();
  }

  async getFirstColValues(): Promise<string[]> {
    const $$contents = [...(await this.$$('firstColCellContent'))];

    return Promise.all(
      $$contents.map(async $content => {
        const $cellValue = await $content.$(this.selectors.cellValue);

        return await $cellValue.getText();
      })
    );
  }
}

export const xTableFilterPanelBlock = new XTableFilterPanelBlock();
