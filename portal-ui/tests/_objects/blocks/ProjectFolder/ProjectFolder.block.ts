import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../Block';
import { achtungBlock } from '../Achtung/Achtung.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

export const sortDirections: Record<string, SortOrder> = {
  'По возрастанию': SortOrder.ASC,
  'По убыванию': SortOrder.DESC
};

class ProjectFolderBlock extends Block {
  selectors = {
    container: '.Projects'
  };

  async deleteConfirmDialog(): Promise<void> {
    await achtungBlock.isDialogExist();
  }

  async openFolder(folder: string): Promise<void> {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();
    await explorerBlock.openExplorerItem(folder);
  }
}

export const projectFolderBlock = new ProjectFolderBlock();
