import { Block } from '../../Block';

class SelectVectorTableDialog extends Block {
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

export const selectVectorTableDialog = new SelectVectorTableDialog();
