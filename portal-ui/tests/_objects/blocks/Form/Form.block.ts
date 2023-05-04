import { Block } from '../../Block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

export class FormBlock extends Block {
  selectors = {
    container: '.Form',
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
    const $tableField = await this.getCreateTableDialogField(title);
    if (!$tableField) {
      throw new Error(`Не найден элемент ${title}`);
    }

    return await $tableField.$('.MuiInputBase-root');
  }
  async getCustomFieldRoot(title: string): Promise<WebdriverIO.Element> {
    const $tableField = await this.getCreateTableDialogField(title);
    if (!$tableField) {
      throw new Error(`Не найден элемент ${title}`);
    }

    return await $tableField.$('.Form-Control_type_custom');
  }

  async getCreateTableDialogField(fieldName: string): Promise<WebdriverIO.Element | undefined> {
    const $$fields = await this.$$('formFields');

    for (const $field of $$fields) {
      const name = await $field.$('.Form-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }
  }
}
