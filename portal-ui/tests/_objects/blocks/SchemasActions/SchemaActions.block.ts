import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { SchemaPropertiesBlock } from '../SchemaProperties/SchemaProperties.block';

class SchemaActionsBlock extends Block {
  selectors = {
    container: '.SchemaActions',
    editBtn: '.SchemaActions-Edit',
    editDialog: '.SchemaActions-EditDialog',
    editDialogYes: '.SchemaActions-EditDialogYes',
    editInJSON: '.SchemaActions-EditInJson',
    editInJSONForm: '.SchemaActions-EditInJsonForm'
  };

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.findBySelector('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
    await sleep(300); // ждем анимации открытия диалога
  }

  async clickEditDialogPropertyByTitle(title: string): Promise<void> {
    const $editDialog = await this.findBySelector('editDialog');
    const schemaProperties = new SchemaPropertiesBlock($editDialog);

    await schemaProperties.clickEditPropertyByTitle(title);
  }

  async changePropertyAttributeByName(title: string, fieldLabel: string): Promise<void> {
    const $editDialog = await this.findBySelector('editDialog');
    const schemaProperties = new SchemaPropertiesBlock($editDialog);
    const $checkbox = await schemaProperties.getInputCheckboxByPropertyTitleAndFieldLabel(title, fieldLabel);

    await $checkbox.click();
  }

  async clickEditJSONBtn(): Promise<void> {
    const $editDialog = await this.findBySelector('editDialog');
    await $editDialog.waitForDisplayed();

    const $editInJSONBtn = await this.findBySelector('editInJSON');
    await $editInJSONBtn.waitForDisplayed();
    await $editInJSONBtn.click();
  }

  async updateSchema(updatedSchema: string): Promise<void> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.editInJSONForm);
    await formBlock.replaceStringValue('Схема', updatedSchema);
  }

  async getEditingSchema(): Promise<Schema> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.editDialog);

    return JSON.parse(await formBlock.getStringValue('Схема')) as Schema;
  }

  async clickSaveBtn(): Promise<void> {
    const $editDialogYes = await this.findBySelector('editDialogYes');
    await $editDialogYes.waitForDisplayed({ timeout: 10_000 });
    await $editDialogYes.click();
    await $editDialogYes.waitForExist({ reverse: true });
  }
}

export const schemaActionsBlock = new SchemaActionsBlock();
