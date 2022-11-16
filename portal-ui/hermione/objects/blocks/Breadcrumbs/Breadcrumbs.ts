import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class Breadcrumbs extends Block {
  selectors = {
    container: '.Breadcrumbs',
    widthControlInStory: '.BreadcrumbsStory-InputControl'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляются хлебные крошки' });
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }

  async setWidthInStory(width: number) {
    const $input = await this.getElement('widthControlInStory');
    await $input.setValue(width);
    await this.browser.pause(300);
  }
}
