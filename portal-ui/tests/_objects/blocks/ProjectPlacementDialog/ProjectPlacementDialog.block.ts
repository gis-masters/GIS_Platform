import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class ProjectPlacementDialogBlock extends Block {
  selectors = {
    root: '.ProjectPlacementDialog'
  };

  async selectRowItem(value: string): Promise<void> {
    const explorerBlock = new ExplorerBlock(this.selectors.root);

    await explorerBlock.selectExplorerItem(value);
  }

  async projectSelectDialogAcceptBtn(): Promise<void> {
    const dialogBlock = new DialogBlock(null, await this.findBySelector('root'));
    await dialogBlock.clickPrimaryActionButton();
    await dialogBlock.waitForHidden();
  }
}

export const projectPlacementDialogBlock = new ProjectPlacementDialogBlock();
