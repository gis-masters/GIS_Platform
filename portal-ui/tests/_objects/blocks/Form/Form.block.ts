import { Block } from '../../Block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

export class FormBlock extends Block {
  selectors = {
    container: '.Form',
    content: '.Form .Form-Content',
    formFields: '.Form .Form-Field'
  };

  async replaceStringValue(title: string, value: string): Promise<void> {
    const $tableFieldValueRoot = await this.getFieldInputRoot(title);
    const inputBlock = new MuiInputBlock($tableFieldValueRoot);
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async setStringValue(title: string, value: string): Promise<void> {
    const $tableFieldValueRoot = await this.getFieldInputRoot(title);
    const tableFieldValue = new MuiInputBlock($tableFieldValueRoot);
    await tableFieldValue.setValue(value);
  }

  async setChoiceValue(title: string, value: string): Promise<void> {
    const $tableFieldValueRoot = await this.getFieldInputRoot(title);
    const tableFieldValue = new MuiSelectBlock($tableFieldValueRoot);
    await tableFieldValue.selectOptionByTitle(value);
  }

  async openSchemaSelection(): Promise<void> {
    const $tableFieldValueRoot = await this.getCustomFieldRoot('Схема*');

    const $schemaSelectBtn = await $tableFieldValueRoot.$('button');
    await $schemaSelectBtn.click();
  }

  async getFieldInputRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getField(title);

    return await $tableField.$('.MuiInputBase-root');
  }

  async getCustomFieldRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getField(title);
    if (!$tableField) {
      throw new Error(`Не найден элемент ${title}`);
    }

    return await $tableField.$('.Form-Control_type_custom');
  }

  async lookupFieldValues(title: string): Promise<string[]> {
    const $field = await this.getField(title);
    const $$items = await $field.$$('.Lookup-Item');

    const itemsValues: string[] = [];

    for (const $item of $$items) {
      itemsValues.push(await $item.getText());
    }

    return itemsValues;
  }

  async getField(fieldName: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    const $content = await this.$('content');
    await $content.waitForDisplayed();

    const $$fields = await this.$$('formFields');

    if (!$$fields.length) {
      throw new Error('В форме отсутствуют поля');
    }

    for (const $field of $$fields) {
      const name = await $field.$('.Form-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }

    throw new Error(`Не найден элемент ${fieldName}`);
  }
}
