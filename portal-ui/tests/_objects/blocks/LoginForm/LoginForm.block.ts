import { Block } from '../../Block';

class LoginFormBlock extends Block {
  selectors = {
    container: '.LoginForm',
    login: '.LoginForm .StringControl_display_email input',
    password: '.LoginForm .StringControl_display_password input',
    errorMessage: '.LoginForm .StringControl_display_password .MuiFormHelperText-root',
    loginBtn: '.LoginForm button[type="submit"]',
    organizationsList: '.LoginForm-OrgSelectList',
    organizationsListItem: '.LoginForm-OrgSelectListItem'
  };

  async fillAndSubmit(login: string, password: string) {
    const $login = await this.$('login');
    await $login.setValue(login);

    const $password = await this.$('password');
    await $password.setValue(password);

    const $loginBtn = await this.$('loginBtn');
    await $loginBtn.click();
  }

  async checkErrorMessage(errorMessage: string) {
    const $errorMessage = await this.$('errorMessage');
    await $errorMessage.waitForDisplayed();
    await expect(await $errorMessage.getText()).toEqual(errorMessage);
  }

  async checkOrganizationsListVisibility() {
    await expect(this.$('organizationsList')).toBeDisplayedInViewport();
  }

  async clickOrganization(orgTitle: string) {
    const $organizationsList = await this.$('organizationsList');
    await $organizationsList.waitForDisplayed();
    const $$organizationsListItems = await this.$$('organizationsListItem');

    for (const $item of $$organizationsListItems) {
      const title = await $item.getText();

      if (title.startsWith(orgTitle)) {
        await $item.click();

        return;
      }
    }

    throw new Error('Не найдена организация ' + orgTitle);
  }

  async getOrganizations(): Promise<string[]> {
    const $$organizationsListItems = await this.$$('organizationsListItem');

    return await Promise.all([...$$organizationsListItems].map(async $item => await $item.getText()));
  }
}

export const loginFormBlock = new LoginFormBlock();
