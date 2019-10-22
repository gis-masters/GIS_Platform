const Page = require('../Page');

module.exports = class LoginPage extends Page {
  _elements = {
    container: 'crg-login-page .container'
  };

  url = 'login';

  waitForVisible () {
    const { container } = this._elements;

    return this.browser.crgWaitForVisible(container, 5000, 'Не появилась страница входа');
  }
};
