import { Key } from 'webdriverio';

import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';

export class MuiMenuBlock extends Block {
  selectors = {
    root: 'div[class*=MuiMenu-root]:not([aria-hidden])  div[class*="MuiPaper-root"]'
  };

  async clickItemByTitle(title: string, contains?: boolean): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    const $item = await $root.$(`.MuiMenuItem-root${contains ? '*' : ''}=${title}`).getElement();
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
