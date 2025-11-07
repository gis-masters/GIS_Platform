import { Block } from '../../../Block';
import { XTableBlock } from '../../XTable/XTable.block';

class UsersAddDialogBlock extends Block {
  selectors = {
    root: '.Users-AddDialog',
    saveBtn: '.Users-AddDialog .MuiButton-outlinedPrimary',
    userRow: '.Users-AddDialog .MuiTable-root .MuiTableRow-root',
    tableContainer: '.Users-AddDialog .XTable-Container',
    loading: '.Users-AddDialog .Loading'
  };

  xTable = new XTableBlock(this.selectors.root);

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

    const $userSelect = await $userRow.$('.MuiTableCell-root:first-child input').getElement();
    await $userSelect.click();

    const $saveBtn = await this.findBySelector('saveBtn');
    await $saveBtn.click();
    await $saveBtn.waitForExist({ reverse: true });
  }

  async save(): Promise<void> {
    const $saveBtn = await this.findBySelector('saveBtn');
    await $saveBtn.click();
    await $saveBtn.waitForExist({ reverse: true });
  }

  async findUser(userName: string): Promise<void> {
    const $tableContainer = await this.findBySelector('tableContainer');
    await $tableContainer.waitForExist();

    const $userRow = await this.findUserRow(userName);

    if (!$userRow) {
      throw new Error(`Не найден пользователь "${userName}"`);
    }
  }

  async getUsersAmount(): Promise<number> {
    await this.waitForVisible();

    const $$userRows = await this.findAllBySelector('userRow');

    return $$userRows.length - 1;
  }

  async findUserRow(userName: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();

    const $$userRows = await this.findAllBySelector('userRow');

    for (const $userRow of $$userRows) {
      const $userRowName = await $userRow.$('.MuiTableCell-root:nth-child(3)').getElement();
      const userRowName = await $userRowName.getText();

      if (userRowName === userName) {
        return $userRow;
      }
    }
  }

  async waitForTableContainer(): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.findBySelector('loading');
    await $loading.waitForExist({ reverse: true });

    const $tableContainer = await this.findBySelector('tableContainer');
    await $tableContainer.waitForDisplayed();
  }
}

export const usersAddDialogBlock = new UsersAddDialogBlock();
