const assert = require('chai').assert;

const Block = require('./Block');

module.exports = class Page extends Block {
  url;

  constructor(browser) {
    super(browser);
  }

  async testUrl() {
    const url = await this.browser.getUrl();
    return assert.include(url, this.url, 'Некорректный url');
  }

  open() {
    return this.browser.url(this.url);
  }
};
