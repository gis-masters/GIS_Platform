import { Block } from '../../Block';

class SelectVectorTableDialogBlock extends Block {
  selectors = {
    container: '.SelectVectorTable-Dialog',
    datasourceDialogAddBtn: '.SelectVectorTable-Dialog .MuiButton-outlinedPrimary'
  };

  async selectVectorTableBtn(): Promise<void> {
    const $datasourceDialogAddBtn = await this.$('datasourceDialogAddBtn');
    await $datasourceDialogAddBtn.waitForDisplayed({ timeout: 3000 });

    await $datasourceDialogAddBtn.click();
  }
}

export const selectVectorTableDialogBlock = new SelectVectorTableDialogBlock();
