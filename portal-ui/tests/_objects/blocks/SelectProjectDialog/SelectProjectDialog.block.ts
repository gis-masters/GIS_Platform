import { Block } from '../../Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';
import { xTableBlock } from '../XTable/XTable.block';

class SelectProjectDialogBlock extends Block {
  selectors = {
    container: '.SelectProjectDialog',
    saveBtn: '.SelectProjectDialog .MuiButton-outlinedPrimary',
    projectRow: '.SelectProjectDialog .MuiTable-root .MuiTableRow-root',
    selectProjection: '.SelectProjectDialog .SelectProjection'
  };

  async save(): Promise<void> {
    const $saveBtn = await this.$('saveBtn');
    await $saveBtn.click();
    await $saveBtn.waitForDisplayed({ reverse: true });
  }

  async selectCrs(crs: string): Promise<void> {
    const $selectProjection = await this.$('selectProjection');
    await $selectProjection.waitForClickable();
    await $selectProjection.click();

    const muiSelect = new MuiMenuBlock();
    await muiSelect.waitForVisible();
    await muiSelect.clickItemByTitle(crs);
  }

  async selectProject(project: string): Promise<void> {
    await this.waitForVisible();
    await xTableBlock.waitForLoading();

    const $userRow = await this.findProjectRow(project);

    if (!$userRow) {
      throw new Error(`Не найден проект "${project}"`);
    }

    const $projectSelect = await $userRow.$('.MuiTableCell-root:first-child input');
    await $projectSelect.click();
  }

  async findProjectRow(project: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();

    const $$projectRows = await this.$$('projectRow');

    for (const $projectRow of $$projectRows) {
      const $projectRowName = await $projectRow.$('.MuiTableCell-root:nth-child(2)');
      const projectRowName = await $projectRowName.getText();

      if (projectRowName === project) {
        return $projectRow;
      }
    }
  }
}
export const selectProjectDialogBlock = new SelectProjectDialogBlock();
