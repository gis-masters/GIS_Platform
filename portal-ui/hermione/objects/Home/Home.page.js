const Page = require('../Page');

module.exports = class HomePage extends Page {
  _elements = {
    container: 'crg-home-page .container'
  }

  url = '';

  waitForVisible () {
    const { container } = this._elements;

    return this.browser.crgWaitForVisible(container, 5000, 'Не появляется начальная страница');
  }

  assertSelfie () {
    const { container } = this._elements;

    return this.browser.assertView('plain', container);
  }
};
