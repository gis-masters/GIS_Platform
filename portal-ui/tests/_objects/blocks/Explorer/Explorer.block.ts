import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

export class ExplorerBlock extends Block {
  selectors = {
    container: '.Explorer',
    item: '.Explorer-Item',
    title: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    viewContentWidget: '.Explorer .ViewContentWidget',
    empty: '.Explorer-Empty',
    createLayerBtn: '.Explorer-ToolbarActions .MuiButtonBase-root[aria-label="Создать слой"]',
    firstItem: '.Explorer-List .Explorer-Item:first-child',
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

  async selectExplorerItem(item: string): Promise<void> {
    const $item = await this.getExplorerItemByName(item);
    if (!$item) {
      throw new Error(`Не найден элемент "${item}"`);
    }

    await $item.click();
  }

  async selectFirstExplorerItem(): Promise<void> {
    const $firstItem = await this.$('firstItem');
    await $firstItem.waitForDisplayed();

    await $firstItem.click();
  }

  async getContentWidgetFieldValue(field: string): Promise<string> {
    const formBlock = new FormBlock(await this.$('viewContentWidget'));
    const $field = await formBlock.getField(field);

    return $field.$('.Form-View').getText();
  }

  async getContentWidgetField(field: string): Promise<WebdriverIO.Element> {
    const $contentWidget = await this.$('viewContentWidget');
    await $contentWidget.waitForDisplayed();
    const formBlock = new FormBlock($contentWidget);

    return await formBlock.getField(field);
  }

  async getExplorerItemsLength(): Promise<number> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $loader = await this.$('loader');
    await $loader.waitForDisplayed({ reverse: true });

    const $$explorerItems = await this.$$('item');

    return $$explorerItems.length;
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
    const $$titles = [...(await this.$$('title'))];

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testEmptiness(): Promise<void> {
    const $empty = await this.$('empty');
    await $empty.waitForDisplayed();
  }

  async getExplorerItemByName(itemName: string): Promise<WebdriverIO.Element> {
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

    throw new Error('Не найдет элемент' + itemName);
  }
}
