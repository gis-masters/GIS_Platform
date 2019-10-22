const Block = require('../Block');

module.exports = class Header extends Block {
  _elements = {
    container: 'crg-header',
    regButton: '.header__button_type_reg',
    loginButton: '.header__button_type_login'
  }

  clickRegButton () {
    const { regButton } = this._elements;

    return this.browser.click(regButton);
  }

  clickLoginButton () {
    const { loginButton } = this._elements;

    return this.browser.click(loginButton);
  }
};
