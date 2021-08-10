import { Block } from '../../Block';

export class Header extends Block {
  selectors = {
    container: 'crg-header',
    regButton: '.header__button_type_reg',
    loginButton: '.header__button_type_login'
  };

  async clickRegButton() {
    const $regButton = await this.getElement('regButton');

    return await $regButton.click();
  }

  async clickLoginButton() {
    const $loginButton = await this.getElement('loginButton');

    return await $loginButton.click();
  }
}
