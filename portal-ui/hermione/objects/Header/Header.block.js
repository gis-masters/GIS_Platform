const Block = require('../Block');

module.exports = class Header extends Block {
  _elements = {
    container: 'crg-header',
    regButton: '.header__button_type_reg',
    loginButton: '.header__button_type_login'
  };

  async clickRegButton() {
    const { regButton } = this._elements;
    const $regButton = await this.browser.$(regButton);

    return await $regButton.click();
  }

  async clickLoginButton() {
    const { loginButton } = this._elements;
    const $loginButton = await this.browser.$(loginButton);

    return await $loginButton.click();
  }
};
