import { Block } from '../../Block';

class MuiMenuList extends Block {
  selectors = {
    container: '.MuiMenu-list',
    menuSecondItem: '.MuiMenu-list li:nth-child(2)',
    menuThirdItem: '.MuiMenu-list li:nth-child(3)'
  };

  async clickMenuSecondItem(): Promise<void> {
    const $menuSecondItem = await this.$('menuSecondItem');
    await $menuSecondItem.waitForDisplayed({ timeout: 2000 });

    await $menuSecondItem.click();
  }

  async clickMenuThirdItem(): Promise<void> {
    const $menuThirdItem = await this.$('menuThirdItem');
    await $menuThirdItem.waitForDisplayed({ timeout: 2000 });

    await $menuThirdItem.click();
  }

  async testMenuSecItemText(title: string) {
    const $menuSecondItem = await this.$('menuSecondItem');
    const text = await $menuSecondItem.getText();

    expect(text).toEqual(title);
  }

  async testMenuThirdItemText(title: string) {
    const $menuThirdItem = await this.$('menuThirdItem');
    const text = await $menuThirdItem.getText();

    expect(text).toEqual(title);
  }
}

export const muiMenuList = new MuiMenuList();
