import { Block } from '../../classes/Block';

class TaskJournalHistoryDialogBlock extends Block {
  selectors = {
    root: '.TaskJournalHistoryDialog'
  };
}

export const taskJournalHistoryDialogBlock = new TaskJournalHistoryDialogBlock();
