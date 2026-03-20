import { Block } from '../../classes/Block';

class BreadcrumbsStoryBlock extends Block {
  selectors = {
    root: '.BreadcrumbsStory',
    input: '.BreadcrumbsStory-InputControl'
  };

  async setWidth(width: string): Promise<void> {
    const $input = await this.findBySelector('input');
    await $input.setValue(width);
    await browser.pause(300);
  }
}

export const breadcrumbsStoryBlock = new BreadcrumbsStoryBlock();
