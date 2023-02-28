import { Block } from '../../Block';

class BreadcrumbsStory extends Block {
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

export const breadcrumbsStory = new BreadcrumbsStory();
