import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

class TasksJournalActionsEditDialogBlock extends Block {
  selectors = {
    container: '.TasksJournalActions-EditDialog',
    tasksJournalActionsEditDialogYes: '.TasksJournalActions-EditDialog .MuiButton-outlinedPrimary',
    error: '.TasksJournalActions-EditDialog .Form-Error',
    item: '.TasksJournalActions-EditDialog .Documents-Item'
  };

  async clickSelectSchemaConfirm(): Promise<void> {
    const $tasksJournalActionsEditDialogYes = await this.$('tasksJournalActionsEditDialogYes');
    await $tasksJournalActionsEditDialogYes.waitForClickable();
    await $tasksJournalActionsEditDialogYes.click();
  }

  async clickAddUserBtn(title: string): Promise<void> {
    await this.waitForVisible();

    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(title);
    const $addUserBtn = await $field.$('.Users-Add');

    await $addUserBtn.click();
  }

  async getFromError(): Promise<string> {
    await this.waitForVisible();

    const $error = await this.$('error');
    await $error.waitForClickable();

    return await $error.getText();
  }

  async getDocValue(fieldTitle: string): Promise<string[]> {
    const formBlock = new FormBlock(this.selectors.container);

    return await formBlock.lookupFieldValues(fieldTitle);
  }

  async selectOption(optionTitle: string, fieldTitle: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(fieldTitle);

    if (!$field) {
      throw new Error(`Не найден элемент ${fieldTitle}`);
    }

    const muiSelect = new MuiSelectBlock($field);
    await muiSelect.selectOptionByTitle(optionTitle);
  }
}

export const tasksJournalActionsEditDialogBlock = new TasksJournalActionsEditDialogBlock();
