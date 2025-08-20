import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

class TasksJournalActionsStatusDialogBlock extends Block {
  selectors = {
    container: '.TasksJournalActions-StatusDialog',
    tasksJournalActionStatusSave: '.TasksJournalActions-StatusDialog .MuiButton-outlinedPrimary'
  };

  async saveChangeStatusAction(): Promise<void> {
    await this.waitForVisible();

    const $tasksJournalActionStatusSave = await this.$('tasksJournalActionStatusSave');
    await $tasksJournalActionStatusSave.click();
  }

  async setChoiceFieldValue(fieldTitle: string, value: string) {
    const formBlock = new FormBlock(this.selectors.container);
    await formBlock.setChoiceValue(fieldTitle, value);
  }
}

export const tasksJournalActionsStatusDialogBlock = new TasksJournalActionsStatusDialogBlock();
