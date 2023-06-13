import { Block } from '../../Block';

class SelectSuitableVectorLayerDialog extends Block {
  selectors = {
    container: '.SelectSuitableVectorLayerDialog',
    copyBtn: '.SelectSuitableVectorLayerDialog .MuiButton-outlinedPrimary'
  };

  async clickSubmitButton(): Promise<void> {
    const $copyBtn = await this.$('copyBtn');
    await $copyBtn.waitForClickable();
    await $copyBtn.click();
  }
}

export const selectSuitableVectorLayerDialog = new SelectSuitableVectorLayerDialog();
