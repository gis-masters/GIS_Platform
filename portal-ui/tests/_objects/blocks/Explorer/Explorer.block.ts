import { sleep } from '../../../../src/app/services/util/sleep';

import { Block } from '../../Block';

class ExplorerBlock extends Block {
  selectors = {
    container: '.Explorer',
    item: '.Explorer-Item',
    title: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    empty: '.Explorer-Empty',
    createLayerBtn: '.Explorer-ToolbarActions .MuiButtonBase-root[aria-label="Создать слой"]',
    firstItemTitle: '.Explorer-List .Explorer-Item:first-child .MuiListItemText-primary',
    secondItemTitle: '.Explorer-List .Explorer-Item:last-child .MuiListItemText-primary',
    connectionToProject: '.Explorer .ConnectionsToProjectsWidget button'
  };

  async openExplorerItem(datatable: string): Promise<void> {
    const $item = await this.getExplorerItemByName(datatable);
    if (!$item) {
      throw new Error(`Не найден элемент "${datatable}"`);
    }

    await $item.doubleClick();
    await sleep(500); // ждем анимации перехода
  }

  async selectExplorerItem(datatable: string): Promise<void> {
    const $item = await this.getExplorerItemByName(datatable);
    if (!$item) {
      throw new Error(`Не найден элемент "${datatable}"`);
    }

    await $item.click();
  }

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.$('connectionToProject');
    await $connectionToProject.click();
  }

  async clickCreateLayerBtn(): Promise<void> {
    const $createLayerBtn = await this.$('createLayerBtn');

    await $createLayerBtn.click();
  }

  async isCreateLayerBtnExist(): Promise<boolean> {
    const $createLayerBtn = await this.$('createLayerBtn');

    return await $createLayerBtn.isExisting();
  }

  async waitForLoading(): Promise<void> {
    await browser.pause(300);
    const $loader = await this.$('loader');
    await $loader.waitForDisplayed({ reverse: true });
    await browser.pause(300);
  }

  async getListTitles(): Promise<string[]> {
    const $title = await this.$('title');
    await $title.waitForDisplayed();
    const $$titles = await this.$$('title');

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testTitles(dirty: string) {
    const titles = dirty.slice(1, -1).split('", "');
    await expect(titles).toEqual(await this.getListTitles());
  }

  async testEmptiness() {
    const $empty = await this.$('empty');
    await $empty.waitForDisplayed();
  }

  async getExplorerItemByName(itemName: string): Promise<WebdriverIO.Element | undefined> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $loader = await this.$('loader');
    await $loader.waitForDisplayed({ reverse: true });

    const $$explorerItems = await this.$$('item');

    for (const $explorerItem of $$explorerItems) {
      const explorerItemName = await $explorerItem.$('.Explorer-ItemTitle').getText();

      if (explorerItemName === itemName) {
        return $explorerItem;
      }
    }
  }
}

export const explorerBlock = new ExplorerBlock();
