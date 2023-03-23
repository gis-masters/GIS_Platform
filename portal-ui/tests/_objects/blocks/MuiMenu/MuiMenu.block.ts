import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';

export class MuiMenuBlock extends Block {
  selectors = {
    container: '.MuiMenu-root div[class*="MuiPaper-root"]'
  };

  $getMenuOption(i: number): Promise<WebdriverIO.Element> {
    return $(`.MuiMenu-root .MuiMenu-list .MuiMenuItem-root:nth-child(${i})`);
  }

  $getMenuOptions(): Promise<WebdriverIO.Element[]> {
    return $$('.MuiMenu-root.MuiModal-root .MuiMenu-list .MuiMenuItem-root');
  }

  async selectOptionByTitle(title: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
    const $$options = await this.$getMenuOptions();
    const menuTitles = await extractText($$options);
    const index = menuTitles.indexOf(title);
    const $option = await this.$getMenuOption(index + 1);

    await $option.click();
    await $option.waitForDisplayed({ reverse: true });
  }
}
