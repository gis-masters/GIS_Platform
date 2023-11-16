import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class SchemaActionsBlock extends Block {
  selectors = {
    container: '.SchemaActions',
    editBtn: '.SchemaActions .SchemaActions-Edit',
    editDialog: '.SchemaActions-EditDialog',
    editDialogYes: '.SchemaActions-EditDialogYes'
  };

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
  }

  async updateSchema(updatedSchema: string): Promise<void> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.editDialog);
    await formBlock.replaceStringValue('Схема', updatedSchema);
  }

  async getEditingSchema(): Promise<Schema> {
    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.editDialog);

    return JSON.parse(await formBlock.getStringValue('Схема')) as Schema;
  }

  async clickSaveBtn(): Promise<void> {
    const $editDialogYes = await this.$('editDialogYes');
    await $editDialogYes.waitForDisplayed({ timeout: 10_000 });
    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }
}

export const schemaActionsBlock = new SchemaActionsBlock();
