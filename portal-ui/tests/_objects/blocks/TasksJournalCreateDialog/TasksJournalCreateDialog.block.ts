import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class TasksJournalCreateDialogBlock extends Block {
  selectors = {
    container: '.TasksJournal-CreateDialog',
    tasksJournalCreateDialogYes: '.TasksJournal-CreateDialog .MuiButton-outlinedPrimary'
  };

  async clickSelectSchemaConfirm(): Promise<void> {
    const $tasksJournalCreateDialogYes = await this.$('tasksJournalCreateDialogYes');
    await $tasksJournalCreateDialogYes.waitForClickable();
    await $tasksJournalCreateDialogYes.click();
  }

  async clickAddUserBtn(title: string): Promise<void> {
    await this.waitForVisible();

    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(title);
    const $addUserBtn = await $field.$('.Users-Add');

    await $addUserBtn.click();
  }
}

export const tasksJournalCreateDialogBlock = new TasksJournalCreateDialogBlock();
