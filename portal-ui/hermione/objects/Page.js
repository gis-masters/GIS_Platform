const assert = require('chai').assert;

const Block = require('./Block');

module.exports = class Page extends Block {
  url;

  constructor(browser) {
    super(browser);
  }

  testUrl () {
    return this.browser.getUrl()
      .then((url) => {
        assert.include(url, this.url, 'Некорректный url');
      });
  }

  open() {
    return this.browser.url(this.url);
  }
};
