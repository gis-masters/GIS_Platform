import { Block } from '../../Block';

class TextOverflowBlock extends Block {
  selectors = {
    container: '.TextOverflow',
    link: '.TextOverflow-PseudoLink'
  };

  async clickButton(): Promise<void> {
    const $link = await this.$('link');
    await $link.click();
  }

  async getButtonLabel(): Promise<string> {
    const $link = await this.$('link');

    return await $link.getText();
  }
}

export const textOverflowBlock = new TextOverflowBlock();
