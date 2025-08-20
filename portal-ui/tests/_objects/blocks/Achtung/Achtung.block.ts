import { Block } from '../../Block';

class AchtungBlock extends Block {
  selectors = {
    container: '.UtilityDialog_type_achtung',
    yes: '.UtilityDialog_type_achtung .MuiButton-outlinedPrimary'
  };

  async isDialogExist(): Promise<boolean> {
    const $achtung = await this.$('container');

    return await $achtung.isDisplayed();
  }

  async closeDialog(): Promise<void> {
    if (await this.isDialogExist()) {
      const $yes = await this.$('yes');
      await $yes.click();
    }
  }
}

export const achtungBlock = new AchtungBlock();
