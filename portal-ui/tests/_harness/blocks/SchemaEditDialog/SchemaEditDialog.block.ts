import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { Block } from '../../classes/Block';
import { FormBlock } from '../Form/Form.block';
import { SchemaPropertiesBlock } from '../SchemaProperties/SchemaProperties.block';

class SchemaEditDialogBlock extends Block {
  selectors = {
    root: '.SchemaEditDialog',
    save: '.SchemaEditDialog-Save',
    jsonToggle: '.SchemaEditDialog-JsonToggle',
    inJsonForm: '.SchemaEditDialog-InJsonForm'
  };

  async clickEditDialogPropertyByTitle(title: string): Promise<void> {
    const $editDialog = await this.findBySelector('root');
    const schemaProperties = new SchemaPropertiesBlock($editDialog);

    await schemaProperties.clickEditPropertyByTitle(title);
  }

  async changePropertyAttributeByName(title: string, fieldLabel: string): Promise<void> {
    const $editDialog = await this.findBySelector('root');
    const schemaProperties = new SchemaPropertiesBlock($editDialog);
    const $checkbox = await schemaProperties.getInputCheckboxByPropertyTitleAndFieldLabel(title, fieldLabel);

    await $checkbox.click();
  }

  async clickEditJSONBtn(): Promise<void> {
    const $editDialog = await this.findBySelector('root');
    await $editDialog.waitForDisplayed();

    const $editInJSONBtn = await this.findBySelector('jsonToggle');
    await $editInJSONBtn.waitForDisplayed();
    await $editInJSONBtn.click();
  }

  async updateSchema(updatedSchema: string): Promise<void> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.inJsonForm);
    await formBlock.replaceStringValue('Схема', updatedSchema);
  }

  async getEditingSchema(): Promise<Schema> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.root);

    return JSON.parse(await formBlock.getStringValue('Схема')) as Schema;
  }

  async clickSaveBtn(): Promise<void> {
    const $save = await this.findBySelector('save');
    await $save.waitForDisplayed({ timeout: 10_000 });
    await $save.click();
    await $save.waitForExist({ reverse: true });
  }
}

export const schemaEditDialogBlock = new SchemaEditDialogBlock();
