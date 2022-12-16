import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { testUsers } from '../../commands/testUsers';

@binding()
class LoginForm extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.LoginForm');
  }

  get $login(): Promise<WebdriverIO.Element> {
    return $('.LoginForm .Form-Control_display_email input');
  }

  get $password(): Promise<WebdriverIO.Element> {
    return $('.LoginForm .Form-Control_display_password input');
  }

  get $errorMessage(): Promise<WebdriverIO.Element> {
    return $('.LoginForm .Form-Control_display_password .MuiFormHelperText-root');
  }

  get $loginBtn(): Promise<WebdriverIO.Element> {
    return $('.LoginForm-ActionsLogin');
  }

  @when(/^я авторизуюсь в форме авторизации как "(.*)"$/)
  async authAs(user: keyof typeof testUsers): Promise<void> {
    const userInfo = testUsers[user];

    const $login = await this.$login;
    await $login.setValue(userInfo.email);

    const $password = await this.$password;
    await $password.setValue(userInfo.password);

    const $loginBtn = await this.$loginBtn;
    await $loginBtn.click();
  }

  @when(/^я ввожу неправильные данные в форму входа$/)
  async authWithError(): Promise<void> {
    const $login = await this.$login;
    await $login.setValue('snape@email');

    const $password = await this.$password;
    await $password.setValue('SnapePasss123');

    const $loginBtn = await this.$loginBtn;
    await $loginBtn.click();
  }

  @then(/^появляется сообщение об ошибке "(.*)"$/)
  async checkErrorMessage(errorMessage: string) {
    const $errorMessage = await this.$errorMessage;
    const error = await $errorMessage.getText();
    expect(error === errorMessage);
  }
}

export const loginForm = new LoginForm();
