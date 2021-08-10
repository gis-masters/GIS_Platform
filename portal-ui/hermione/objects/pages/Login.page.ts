import { Page } from '../Page';

export class LoginPage extends Page {
  selectors = {
    container: 'crg-login-page .container'
  };

  url = 'login';

  async waitForVisible() {
    const $container = await this.getElement('container');

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница входа' });
  }
}
