import { Page } from '../Page';

export class RegisterPage extends Page {
  selectors = {
    container: 'crg-register .container'
  };

  url = 'register';

  async waitForVisible() {
    const $container = await this.getElement('container');

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница регистрации' });
  }
}
