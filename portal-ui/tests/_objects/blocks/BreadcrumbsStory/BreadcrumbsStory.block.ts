import { Block } from '../../Block';

class BreadcrumbsStoryBlock extends Block {
  selectors = {
    container: '.BreadcrumbsStory',
    input: '.BreadcrumbsStory-InputControl'
  };

  async setWidth(width: string): Promise<void> {
    const $input = await this.$('input');
    await $input.setValue(width);
    await browser.pause(300);
  }
}

export const breadcrumbsStoryBlock = new BreadcrumbsStoryBlock();
