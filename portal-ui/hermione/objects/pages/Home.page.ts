import { Page } from '../Page';

export class HomePage extends Page {
  selectors = {
    container: 'crg-home-page .container'
  };

  url = '/';

  async waitForVisible(): Promise<true | void> {
    const $container = await this.getElement('container');

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появляется начальная страница' });
  }

  async assertSelfie(): Promise<void> {
    return await this.browser.assertView('plain', this.selectors.container);
  }
}
