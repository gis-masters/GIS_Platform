import { Block } from '../../Block';

class TaskJournalHistoryDialogBlock extends Block {
  selectors = {
    container: '.TaskJournalHistoryDialog'
  };
}

export const taskJournalHistoryDialogBlock = new TaskJournalHistoryDialogBlock();
