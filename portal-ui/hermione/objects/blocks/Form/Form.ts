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

  async getInputValue(inputName: string): Promise<string> {
    const $container = await this.getElement('container');
    const $input = await $container.$(`input[name="${inputName}"]`);

    return await $input.getValue();
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }
}
