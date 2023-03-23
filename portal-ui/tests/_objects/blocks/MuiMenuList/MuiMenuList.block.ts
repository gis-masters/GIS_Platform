import { Block } from '../../Block';
class MuiMenuListBlock extends Block {
  selectors = {
    container: '.MuiMenu-list',
    menuSecondItem: '.MuiMenu-list li:nth-child(2)'
  };
  async clickMenuSecondItem(): Promise<void> {
    const $menuSecondItem = await this.$('menuSecondItem');
    await $menuSecondItem.waitForDisplayed({ timeout: 2000 });
    await $menuSecondItem.click();
  }

  async testMenuSecItemText(title: string) {
    const $menuSecondItem = await this.$('menuSecondItem');
    const text = await $menuSecondItem.getText();
    expect(text).toEqual(title);
  }
}
export const muiMenuListBlock = new MuiMenuListBlock();
