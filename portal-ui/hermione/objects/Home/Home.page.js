const Page = require('../Page');

module.exports = class HomePage extends Page {
  _elements = {
    container: 'crg-home-page .container'
  };

  url = '/';

  async waitForVisible() {
    const { container } = this._elements;
    const $container = await this.browser.$(container);

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появляется начальная страница' });
  }

  assertSelfie() {
    const { container } = this._elements;

    return this.browser.assertView('plain', container);
  }
};
