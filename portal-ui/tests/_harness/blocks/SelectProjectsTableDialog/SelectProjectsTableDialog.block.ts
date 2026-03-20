import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';
import { xTableBlock } from '../XTable/XTable.block';

class SelectProjectsTableDialogBlock extends Block {
  selectors = {
    root: '.SelectProjectsTableDialog',
    submit: '.SelectProjectsTableDialog .MuiButton-outlinedPrimary',
    projectRow: '.SelectProjectsTableDialog .MuiTable-root .MuiTableRow-root'
  };

  async selectProject(project: string): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();

    const $userRow = await this.findProjectRow(project);

    if (!$userRow) {
      throw new Error(`Не найден проект "${project}"`);
    }

    const $projectSelect = await $userRow.$('.MuiTableCell-root:first-child input').getElement();
    await $projectSelect.click();
    await this.submit();
  }

  private async submit(): Promise<void> {
    const dialogBlock = new DialogBlock(null, await this.findBySelector('root'));
    await dialogBlock.clickPrimaryActionButton();
    await dialogBlock.waitForHidden();
  }

  private async findProjectRow(project: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();

    const $$projectRows = await this.findAllBySelector('projectRow');

    for (const $projectRow of $$projectRows) {
      const $projectRowName = await $projectRow.$('.MuiTableCell-root:nth-child(2)').getElement();
      const projectRowName = await $projectRowName.getText();

      if (projectRowName === project) {
        return $projectRow;
      }
    }
  }
}

export const selectProjectsTableDialogBlock = new SelectProjectsTableDialogBlock();
