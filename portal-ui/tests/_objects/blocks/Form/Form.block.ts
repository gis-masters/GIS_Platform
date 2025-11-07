import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

export class FormBlock extends Block {
  selectors = {
    root: '.Form',
    content: '.Form .Form-Content',
    formFields: '.Form .Form-Field',
    checkbox: '.Form-Control input[type="checkbox"]'
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

  async getStringValue(title: string): Promise<string> {
    const $tableFieldValueRoot = await this.getFieldInputRoot(title);
    const tableFieldValue = new MuiInputBlock($tableFieldValueRoot);

    return await tableFieldValue.getValue();
  }

  async setChoiceValue(title: string, value: string): Promise<void> {
    const $tableFieldValueRoot = await this.getFieldInputRoot(title);
    const tableFieldValue = new MuiSelectBlock($tableFieldValueRoot);
    await tableFieldValue.selectOptionByTitle(value);
  }

  async openSchemaSelection(): Promise<void> {
    const $tableFieldValueRoot = await this.getCustomFieldRoot('Схема*');

    const $schemaSelectBtn = await $tableFieldValueRoot.$('button').getElement();
    await $schemaSelectBtn.click();
  }

  async getFieldInputRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getField(title);

    return await $tableField.$('.MuiInputBase-root').getElement();
  }

  async getCustomFieldRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getField(title);

    return await $tableField.$('.Form-Control_type_custom').getElement();
  }

  async lookupFieldValues(title: string): Promise<string[]> {
    const $field = await this.getField(title);
    const $$items = await $field.$$('.Lookup-Item').getElements();

    const itemsValues: string[] = [];

    for (const $item of $$items) {
      itemsValues.push(await $item.getText());
    }

    return itemsValues;
  }

  async getField(fieldTitle: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    const $content = await this.findBySelector('content');
    await $content.waitForDisplayed();

    const $$fields = await this.findAllBySelector('formFields');

    if (!$$fields.length) {
      throw new Error('В форме отсутствуют поля');
    }

    const fieldTitles: string[] = [];

    for (const $field of $$fields) {
      const title = await $field.$('.Form-Label').getText();
      fieldTitles.push(title);
      if (title === fieldTitle) {
        return $field;
      }
    }

    throw new Error(`Не найден элемент ${fieldTitle} (присутствуют поля: ${fieldTitles.join(', ')})`);
  }

  async hasField(fieldTitle: string): Promise<boolean> {
    try {
      await this.getField(fieldTitle);

      return true;
    } catch {
      return false;
    }
  }

  async getAllFields(): Promise<string[]> {
    await this.waitForVisible();
    const $content = await this.findBySelector('content');
    await $content.waitForDisplayed();

    const $$fields = await this.findAllBySelector('formFields');

    const fieldTitles: string[] = [];

    if (!$$fields.length) {
      throw new Error('В форме отсутствуют поля');
    }

    for (const $field of $$fields) {
      const title = await $field.$('.Form-Label').getText();

      fieldTitles.push(title);
    }

    return fieldTitles;
  }

  async getFieldCheckboxInputRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getField(title);

    return await $tableField.$(this.selectors.checkbox).getElement();
  }
}
