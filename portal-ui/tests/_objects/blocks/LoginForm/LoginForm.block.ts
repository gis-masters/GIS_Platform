import { Block } from '../../Block';

class LoginFormBlock extends Block {
  selectors = {
    root: '.LoginForm',
    login: '.LoginForm .StringControl_display_email input',
    password: '.LoginForm .StringControl_display_password input',
    errorMessage: '.LoginForm .StringControl_display_password .MuiFormHelperText-root',
    loginBtn: '.LoginForm button[type="submit"]',
    organizationsList: '.LoginForm-OrgSelectList',
    organizationsListItem: '.LoginForm-OrgSelectListItem',
    loading: '.LoginForm-Loading'
  };

  async fillAndSubmit(login: string, password: string) {
    const $login = await this.findBySelector('login');
    await $login.setValue(login);

    const $password = await this.findBySelector('password');
    await $password.setValue(password);

    const $loginBtn = await this.findBySelector('loginBtn');
    await $loginBtn.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForLoading();
    const $errorMessage = await this.findBySelector('errorMessage');
    await $errorMessage.waitForDisplayed();

    return await $errorMessage.getText();
  }

  async checkOrganizationsListVisibility() {
    const $organizationsList = await this.findBySelector('organizationsList');
    await $organizationsList.waitForDisplayed();
  }

  async clickOrganization(orgTitle: string) {
    const $organizationsList = await this.findBySelector('organizationsList');
    await $organizationsList.waitForDisplayed();
    const $$organizationsListItems = await this.findAllBySelector('organizationsListItem');

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
    const $$organizationsListItems = await this.findAllBySelector('organizationsListItem');

    return await Promise.all([...$$organizationsListItems].map(async $item => await $item.getText()));
  }

  async waitForLoading(): Promise<void> {
    const $loading = await this.findBySelector('loading');
    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await $loading.waitForExist({ reverse: true });
  }
}

export const loginFormBlock = new LoginFormBlock();
