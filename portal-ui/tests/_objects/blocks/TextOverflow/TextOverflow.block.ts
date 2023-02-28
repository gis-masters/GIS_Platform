import { Block } from '../../Block';

class TextOverflow extends Block {
  selectors = {
    container: '.TextOverflow',
    link: '.TextOverflow-PseudoLink'
  };

  async clickShowAllButton(): Promise<void> {
    const $link = await this.$('link');
    await $link.click();
  }

  async clickHideTextButton(): Promise<void> {
    const $link = await this.$('link');
    await $link.click();
  }
}

export const textOverflow = new TextOverflow();
