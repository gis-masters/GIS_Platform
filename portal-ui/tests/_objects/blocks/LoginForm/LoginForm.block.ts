import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { testUsers } from '../../commands/auth/testUsers';

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
    return $('.LoginForm button[type="submit"]');
  }

  get $organizationsList(): Promise<WebdriverIO.Element> {
    return $('.LoginForm-OrgSelectList');
  }

  get $$organizationsListItems(): Promise<WebdriverIO.Element[]> {
    return $$('.LoginForm-OrgSelectListItem');
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

  @then(/^на форме входа появляется сообщение об ошибке "(.*)"$/)
  async checkErrorMessage(errorMessage: string) {
    const $errorMessage = await this.$errorMessage;
    await $errorMessage.waitForDisplayed();
    expect(await $errorMessage.getText()).toEqual(errorMessage);
  }

  @then(/^на форме входа появляется выбор организации$/)
  async checkOrganizationsListVisibility() {
    await expect(this.$organizationsList).toBeDisplayedInViewport();
  }

  @when(/^я нажимаю на пункт "(.*)" в списке организаций в форме авторизации$/)
  async clickOrganization(orgTitle: string) {
    const $organizationsList = await this.$organizationsList;
    await $organizationsList.waitForDisplayed();
    const $$organizationsListItems = await this.$$organizationsListItems;

    for (const $item of $$organizationsListItems) {
      const title = await $item.getText();

      if (title === orgTitle) {
        await $item.click();

        return;
      }
    }

    throw new Error('Не найдена организация ' + orgTitle);
  }

  @then(/^в списке организаций на форме входа перечислены: (".+"[ ,]*)+$/)
  async checkOrganizationsList(dirty: string) {
    const titles = dirty.slice(1, -1).split('", "');
    expect(titles).toEqual(await this.getOrganizations());
  }

  async getOrganizations(): Promise<string[]> {
    const $$organizationsListItems = await this.$$organizationsListItems;

    return await Promise.all($$organizationsListItems.map(async $item => await $item.getText()));
  }
}

export const loginForm = new LoginForm();
