import { Block } from '../../Block';

class SelectVectorTableControlDialogBlock extends Block {
  selectors = {
    container: '.SelectVectorTableControl-Dialog',
    datasourceDialogAddBtn: '.SelectVectorTableControl-Dialog .MuiButton-outlinedPrimary'
  };

  async selectVectorTableBtn(): Promise<void> {
    const $datasourceDialogAddBtn = await this.$('datasourceDialogAddBtn');
    await $datasourceDialogAddBtn.waitForDisplayed({ timeout: 3000 });

    await $datasourceDialogAddBtn.click();
  }
}

export const selectVectorTableControlDialogBlock = new SelectVectorTableControlDialogBlock();
