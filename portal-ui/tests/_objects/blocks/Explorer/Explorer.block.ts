import { sleep } from '../../../../src/app/services/util/sleep';

import { Block } from '../../Block';

class ExplorerBlock extends Block {
  selectors = {
    container: '.Explorer',
    item: '.Explorer-Item',
    title: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    empty: '.Explorer-Empty',
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

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.$('connectionToProject');
    await $connectionToProject.click();
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
    expect(titles).toEqual(await this.getListTitles());
  }

  async testEmptiness() {
    await expect(this.$('empty')).toBeDisplayedInViewport();
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
