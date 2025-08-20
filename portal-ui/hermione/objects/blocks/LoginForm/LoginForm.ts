import { Block } from '../../Block';

export class LoginForm extends Block {
  selectors = {
    form: '.LoginForm',
    loginInput: '.LoginForm input[name="username"]',
    passwordInput: '.LoginForm input[name="password"]',
    button: '.LoginForm button[type="submit"]'
  };

  async clickSubmit(): Promise<void> {
    const $button = await this.getElement('button');
    await $button.click();
  }

  async fill(login: string, password: string): Promise<void> {
    const [$loginInput, $passwordInput] = await this.getElementsList(['loginInput', 'passwordInput']);
    await $loginInput.setValue(login);
    await $passwordInput.setValue(password);
  }

  async login(login: string, password: string): Promise<void> {
    await this.fill(login, password);
    await this.clickSubmit();
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    return await this.browser.assertView(state, this.selectors.form);
  }
}
