import { Block } from '../../Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { SelectProjectionBlock } from '../SelectProjection/SelectProjection.block';

class SelectProjectDialogBlock extends Block {
  selectors = {
    root: '.SelectProjectDialog',
    submit: '.SelectProjectDialog .MuiButton-outlinedPrimary',
    projectRow: '.SelectProjectDialog .MuiTable-root .MuiTableRow-root',
    selectProjection: '.SelectProjectDialog .SelectProjection'
  };

  private async submit(): Promise<void> {
    const dialogBlock = new DialogBlock(null, await this.findBySelector('root'));
    await dialogBlock.clickPrimaryActionButton();
    await dialogBlock.waitForHidden();
  }

  async selectCrs(crs: string): Promise<void> {
    const selectProjectionBlock = new SelectProjectionBlock(null, await this.findBySelector('selectProjection'));
    await selectProjectionBlock.select(crs);
  }

  async selectProject(project: string): Promise<void> {
    await this.waitForVisible();
    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));
    await explorerBlock.waitForLoading();
    await explorerBlock.selectExplorerItem(project);
    await this.submit();
  }

  async allItemsAreDisabled(): Promise<boolean> {
    const explorerBlock = new ExplorerBlock(await this.findBySelector('root'));

    return await explorerBlock.allItemsAreDisabled();
  }
}

export const selectProjectDialogBlock = new SelectProjectDialogBlock();
