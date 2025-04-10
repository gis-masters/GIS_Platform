import { Block } from '../../Block';

class KonfirmierenBlock extends Block {
  selectors = {
    container: '.UtilityDialog_type_konfirmieren',
    yes: '.UtilityDialog_type_konfirmieren .MuiButton-outlinedPrimary'
  };

  async isDialogExist(): Promise<boolean> {
    const $konfirmieren = await this.$('container');

    return await $konfirmieren.isDisplayed();
  }

  async closeDialog(): Promise<void> {
    if (await this.isDialogExist()) {
      const $yes = await this.$('yes');
      await $yes.click();
    }
  }
}

export const konfirmierenBlock = new KonfirmierenBlock();
