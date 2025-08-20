import { Key } from 'webdriverio';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';

export class MuiMenuBlock extends Block {
  selectors = {
    container: 'div[class*=MuiMenu-root]:not([aria-hidden])  div[class*="MuiPaper-root"]'
  };

  async clickItemByTitle(title: string, contains?: boolean): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $item = await $container.$(`.MuiMenuItem-root${contains ? '*' : ''}=${title}`);
    await $item.waitForClickable();
    await $item.click();
    await sleep(300); // Анимация исчезновения меню
  }

  async close(): Promise<void> {
    await browser.keys([Key.Escape]);
    await sleep(300); // Анимация исчезновения меню
  }
}

export const muiMenuBlock = new MuiMenuBlock();
