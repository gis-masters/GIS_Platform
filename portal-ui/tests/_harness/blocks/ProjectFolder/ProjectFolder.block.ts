import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../classes/Block';
import { answerModalTypeAlertBlock } from '../AnswerModal/_type/AnswerModal_type_alert.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

export const sortDirections: Record<string, SortOrder> = {
  'По возрастанию': SortOrder.ASC,
  'По убыванию': SortOrder.DESC
};

class ProjectFolderBlock extends Block {
  selectors = {
    root: '.Projects'
  };

  async deleteConfirmDialog(): Promise<void> {
    await answerModalTypeAlertBlock.waitForVisible();
  }

  async openFolder(folder: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();
    await explorerBlock.openExplorerItem(folder);
  }
}

export const projectFolderBlock = new ProjectFolderBlock();
