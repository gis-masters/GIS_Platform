import { Block } from '../../../Block';
import { XTableBlock } from '../../XTable/XTable.block';

class UsersAddDialogBlock extends Block {
  selectors = {
    container: '.Users-AddDialog',
    saveBtn: '.Users-AddDialog .MuiButton-outlinedPrimary',
    userRow: '.Users-AddDialog .MuiTable-root .MuiTableRow-root',
    tableContainer: '.Users-AddDialog .XTable-Container',
    loading: '.Users-AddDialog .Loading'
  };

  xTable = new XTableBlock(this.selectors.container);

  async waitForVisible(): Promise<void> {
    await super.waitForVisible();
    await browser.pause(300); // анимация появления диалога
  }

  async setFilter(colTitle: string, filter: string): Promise<void> {
    await this.xTable.filterStringColumn(colTitle, filter);
  }

  async getSecondColValues(): Promise<string[]> {
    return await this.xTable.getSecondColValues();
  }

  async selectUser(userName: string): Promise<void> {
    await this.waitForTableContainer();

    const $userRow = await this.findUserRow(userName);

    if (!$userRow) {
      throw new Error(`Не найден пользователь "${userName}"`);
    }

    const $userSelect = await $userRow.$('.MuiTableCell-root:first-child input');
    await $userSelect.click();

    const $saveBtn = await this.$('saveBtn');
    await $saveBtn.click();
    await $saveBtn.waitForDisplayed({ reverse: true });
  }

  async save(): Promise<void> {
    const $saveBtn = await this.$('saveBtn');
    await $saveBtn.click();
    await $saveBtn.waitForDisplayed({ reverse: true });
  }

  async findUser(userName: string): Promise<void> {
    const $tableContainer = await this.$('tableContainer');
    await $tableContainer.waitForDisplayed();

    const $userRow = await this.findUserRow(userName);

    if (!$userRow) {
      throw new Error(`Не найден пользователь "${userName}"`);
    }
  }

  async getUsersAmount(): Promise<number> {
    await this.waitForVisible();

    const $$userRows = await this.$$('userRow');

    return $$userRows.length - 1;
  }

  async findUserRow(userName: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();

    const $$userRows = await this.$$('userRow');

    for (const $userRow of $$userRows) {
      const $userRowName = await $userRow.$('.MuiTableCell-root:nth-child(3)');
      const userRowName = await $userRowName.getText();

      if (userRowName === userName) {
        return $userRow;
      }
    }
  }

  async waitForTableContainer(): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });

    const $tableContainer = await this.$('tableContainer');
    await $tableContainer.waitForDisplayed({ timeout: 5000 });
  }
}

export const usersAddDialogBlock = new UsersAddDialogBlock();
