const Page = require('../Page');

module.exports = class LoginPage extends Page {
  _elements = {
    container: 'crg-login-page .container'
  };

  url = 'login';

  async waitForVisible() {
    const { container } = this._elements;
    const $container = await this.browser.$(container);

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница входа' });
  }
};
