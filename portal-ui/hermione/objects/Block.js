module.exports = class Block {
  browser;

  parentSelector = '';

  _elements = {};

  constructor(browser, parentSelector) {
    this.browser = browser;
    this.parentSelector = parentSelector;
  }
};
