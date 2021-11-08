import { Block } from '../../Block';

declare const env: { setEnv(env: Record<string, unknown>): void };

export class Form extends Block {
  selectors = {
    container: '.Form'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется форма' });
  }

  async assertSelfie(state: string): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView('plain', container);
  }
}
