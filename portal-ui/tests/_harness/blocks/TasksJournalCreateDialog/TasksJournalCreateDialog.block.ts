import { Block } from '../../classes/Block';
import { FormBlock } from '../Form/Form.block';

class TasksJournalCreateDialogBlock extends Block {
  selectors = {
    root: '.TasksJournal-CreateDialog',
    tasksJournalCreateDialogYes: '.TasksJournal-CreateDialog .MuiButton-outlinedPrimary'
  };

  async clickSelectSchemaConfirm(): Promise<void> {
    const $tasksJournalCreateDialogYes = await this.findBySelector('tasksJournalCreateDialogYes');
    await $tasksJournalCreateDialogYes.waitForClickable();
    await $tasksJournalCreateDialogYes.click();
  }

  async clickAddUserBtn(title: string): Promise<void> {
    await this.waitForVisible();

    const formBlock = new FormBlock(this.selectors.root);
    const $field = await formBlock.getField(title);
    const $addUserBtn = await $field.$('.Users-Add').getElement();

    await $addUserBtn.click();
  }
}

export const tasksJournalCreateDialogBlock = new TasksJournalCreateDialogBlock();
