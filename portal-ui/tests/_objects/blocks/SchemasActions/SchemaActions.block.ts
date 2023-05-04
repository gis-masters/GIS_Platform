import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';

class SchemaActionsBlock extends Block {
  selectors = {
    container: '.SchemaActions',
    editBtn: '.SchemaActions .SchemaActions-Edit',
    dialogEdit: '.SchemaActions-EditDialog',
    dialogEditYes: '.SchemaActions-EditDialogYes',
    viewValue: '.Form-ViewValue_code'
  };

  async clickEditBtn(): Promise<void> {
    const $editBtn = await this.$('editBtn');
    await $editBtn.waitForDisplayed();
    await $editBtn.click();
  }

  async updateSchema(updatedSchema: string): Promise<void> {
    const $editDialogYes = await this.$('dialogEditYes');
    await $editDialogYes.waitForDisplayed({ timeout: 10_000 });

    await browser.pause(500); // анимация появления диалога

    const formBlock = new FormBlock(this.selectors.dialogEdit);
    await formBlock.replaceStringValue('Схема', updatedSchema);

    await $editDialogYes.click();
    await $editDialogYes.waitForDisplayed({ reverse: true });
  }

  async getSelectedSchema(): Promise<Schema> {
    const $viewValue = await this.$('viewValue');
    await $viewValue.waitForDisplayed();

    const updatedSchema = await $viewValue.getText();

    return JSON.parse(updatedSchema) as Schema;
  }
}

export const schemaActionsBlock = new SchemaActionsBlock();
