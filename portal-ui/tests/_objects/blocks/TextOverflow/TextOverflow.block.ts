import { Block } from '../../Block';

class TextOverflowBlock extends Block {
  selectors = {
    root: '.TextOverflow',
    link: '.TextOverflow-PseudoLink'
  };

  async clickButton(): Promise<void> {
    const $link = await this.findBySelector('link');
    await $link.click();
  }

  async getButtonLabel(): Promise<string> {
    const $link = await this.findBySelector('link');

    return await $link.getText();
  }
}

export const textOverflowBlock = new TextOverflowBlock();
