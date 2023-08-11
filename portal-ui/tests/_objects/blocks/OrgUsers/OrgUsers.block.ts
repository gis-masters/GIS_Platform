import { Block } from '../../Block';

class OrgUsersBlock extends Block {
  selectors = {
    container: '.OrgUsers',
    loading: '.OrgUsers .Loading',
    userRow: '.OrgUsers .MuiTable-root .MuiTableRow-root',
    createUser: '.OrgUsers-Create'
  };

  async clickCreateUserButton(): Promise<void> {
    await this.waitForVisible();

    const $createUser = await this.$('createUser');
    await $createUser.click();
  }

  async clickEditUserButton(userName: string): Promise<void> {
    await this.waitForVisible();

    const $userRow = await this.findUserRow(userName);

    const $editUserBtn = await $userRow.$('.OrgActions-Edit');
    await $editUserBtn.click();
  }

  async getUserBoss(userName: string): Promise<string> {
    await this.waitForVisible();
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });

    const $userRow = await this.findUserRow(userName);

    const $userBoss = await $userRow.$('.MuiTableCell-root:nth-child(6)');

    return await $userBoss.getText();
  }

  async findUserRow(userName: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();

    const $$userRows = await this.$$('userRow');

    for (const $userRow of $$userRows) {
      const $userRowName = await $userRow.$('.MuiTableCell-root:nth-child(2)');
      const userRowName = await $userRowName.getText();

      if (userRowName === userName) {
        return $userRow;
      }
    }

    throw new Error(`Не найден пользователь "${userName}"`);
  }
}

export const orgUsersBlock = new OrgUsersBlock();
