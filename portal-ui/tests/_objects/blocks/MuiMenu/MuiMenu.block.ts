import { Block } from '../../Block';
import { sleep } from '../../../../src/app/services/util/sleep';

export class MuiMenuBlock extends Block {
  selectors = {
    container: 'div[class*=MuiMenu-root]:not([aria-hidden])  div[class*="MuiPaper-root"]'
  };

  async clickItemByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $item = await $container.$(`.MuiMenuItem-root=${title}`);
    await $item.waitForClickable({ timeout: 9000 });
    await $item.click();
    await sleep(300); // Анимация исчезновения меню
  }
}

export const muiMenuBlock = new MuiMenuBlock();
