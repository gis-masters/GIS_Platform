import { Block } from '../../classes/Block';

class SelectVectorTableControlDialogBlock extends Block {
  selectors = {
    root: '.SelectVectorTableControl-Dialog',
    datasourceDialogAddBtn: '.SelectVectorTableControl-Dialog .MuiButton-outlinedPrimary'
  };

  async selectVectorTableBtn(): Promise<void> {
    const $datasourceDialogAddBtn = await this.findBySelector('datasourceDialogAddBtn');
    await $datasourceDialogAddBtn.waitForDisplayed({ timeout: 3000 });

    await $datasourceDialogAddBtn.click();
  }
}

export const selectVectorTableControlDialogBlock = new SelectVectorTableControlDialogBlock();
