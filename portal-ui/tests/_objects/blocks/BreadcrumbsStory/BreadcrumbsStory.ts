import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class BreadcrumbsStory extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.BreadcrumbsStory');
  }

  get $input(): Promise<WebdriverIO.Element> {
    return $('.BreadcrumbsStory-InputControl');
  }

  @when(/^я устанавливаю ширину хлебных крошек в (\d*) пикселей$/)
  async setWidth(width: string): Promise<void> {
    const $input = await this.$input;
    await $input.setValue(width);
    await browser.pause(300);
  }
}

export const breadcrumbsStory = new BreadcrumbsStory();
