import { Block } from '../../Block';

export class MuiMenuBlock extends Block {
  selectors = {
    container: 'div[class*=MuiMenu-root]:not([aria-hidden])  div[class*="MuiPaper-root"]'
  };

  async clickItemByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $item = await $container.$(`.MuiMenuItem-root=${title}`);
    await $item.waitForClickable();
    await $item.click();
  }
}

export const muiMenuBlock = new MuiMenuBlock();
