const Page = require('../Page');

module.exports = class RegisterPage extends Page {
  _elements = {
    container: 'crg-register .container'
  }

  url = 'register';

  waitForVisible () {
    const { container } = this._elements;

    return this.browser.crgWaitForVisible(container, 5000, 'Не появилась страница регистрации');
  }
};
