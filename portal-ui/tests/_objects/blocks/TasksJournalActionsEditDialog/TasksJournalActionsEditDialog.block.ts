import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class TasksJournalActionsEditDialogBlock extends Block {
  selectors = {
    container: '.TasksJournalActions-EditDialog',
    TasksJournalActionsEditDialogYes: '.TasksJournalActions-EditDialog .MuiButton-outlinedPrimary'
  };

  async clickSelectSchemaConfirm(): Promise<void> {
    const $TasksJournalActionsEditDialogYes = await this.$('TasksJournalActionsEditDialogYes');
    await $TasksJournalActionsEditDialogYes.waitForClickable();
    await $TasksJournalActionsEditDialogYes.click();
  }

  async clickAddUserBtn(title: string): Promise<void> {
    await this.waitForVisible();

    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(title);
    const $addUserBtn = await $field.$('.Users-Add');

    await $addUserBtn.click();
  }
}

export const tasksJournalActionsEditDialogBlock = new TasksJournalActionsEditDialogBlock();
