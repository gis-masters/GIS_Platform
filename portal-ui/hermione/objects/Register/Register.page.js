const Page = require('../Page');

module.exports = class RegisterPage extends Page {
  _elements = {
    container: 'crg-register .container'
  };

  url = 'register';

  async waitForVisible() {
    const { container } = this._elements;
    const $container = await this.browser.$(container);

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница регистрации' });
  }
};
