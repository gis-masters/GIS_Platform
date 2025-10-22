/* eslint-disable sonarjs/no-duplicate-string */
import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

export class ExplorerBlock extends Block {
  selectors = {
    container: '.Explorer',
    item: '.Explorer-Item',
    disabledItem: '.Explorer-Item.Mui-disabled',
    title: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    viewContentWidget: '.Explorer .ViewContentWidget',
    empty: '.Explorer-Empty',
    createLayerBtn: '.Explorer-ToolbarActions .MuiButtonBase-root[aria-label="Создать векторную таблицу"]',
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
    await this.waitForVisible();

    const $item = await this.getExplorerItemByName(item);
    if (!$item) {
      throw new Error(`Не найден элемент "${item}"`);
    }

    await $item.click();
  }

  async allItemsIsDisabled(): Promise<boolean> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    const $loader = await this.findBySelector('loader');
    await $loader.waitForExist({ reverse: true });

    const $$explorerItems = await this.findAllBySelector('item');
    const $$explorerDisablesItems = await this.findAllBySelector('disabledItem');

    return $$explorerItems.length === $$explorerDisablesItems.length;
  }

  async selectFirstExplorerItem(): Promise<void> {
    const $firstItem = await this.findBySelector('firstItem');
    await $firstItem.waitForDisplayed();

    await $firstItem.click();
  }

  async getContentWidgetFieldValue(field: string): Promise<string> {
    const formBlock = new FormBlock(await this.findBySelector('viewContentWidget'));
    const $field = await formBlock.getField(field);

    return $field.$('.Form-View').getText();
  }

  async getContentWidgetField(field: string): Promise<WebdriverIO.Element> {
    const $contentWidget = await this.findBySelector('viewContentWidget');
    await $contentWidget.waitForDisplayed();
    const formBlock = new FormBlock($contentWidget);

    return await formBlock.getField(field);
  }

  async getExplorerItemsLength(): Promise<number> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    const $loader = await this.findBySelector('loader');
    await $loader.waitForExist({ reverse: true });

    const $$explorerItems = await this.findAllBySelector('item');

    return $$explorerItems.length;
  }

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.findBySelector('connectionToProject');
    await $connectionToProject.click();
  }

  async clickCreateLayerBtn(): Promise<void> {
    const $createLayerBtn = await this.findBySelector('createLayerBtn');

    await $createLayerBtn.click();
  }

  async isCreateLayerBtnExist(): Promise<boolean> {
    const $createLayerBtn = await this.findBySelector('createLayerBtn');

    return await $createLayerBtn.isExisting();
  }

  async waitForLoading(): Promise<void> {
    await browser.pause(300);
    const $loader = await this.findBySelector('loader');
    await $loader.waitForExist({ reverse: true });
    await browser.pause(300);
  }

  async getListTitles(): Promise<string[]> {
    const $title = await this.findBySelector('title');
    await $title.waitForDisplayed();
    const $$titles = [...(await this.findAllBySelector('title'))];

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testEmptiness(): Promise<void> {
    const $empty = await this.findBySelector('empty');
    await $empty.waitForDisplayed();
  }

  async getExplorerItemByName(itemName: string): Promise<WebdriverIO.Element> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    const $loader = await this.findBySelector('loader');
    await $loader.waitForExist({ reverse: true });

    const $$explorerItems = await this.findAllBySelector('item');

    for (const $explorerItem of $$explorerItems) {
      const explorerItemName = await $explorerItem.$('.Explorer-ItemTitle').getText();

      if (explorerItemName === itemName) {
        return $explorerItem;
      }
    }

    throw new Error('Не найдет элемент' + itemName);
  }

  async getExplorerItemById(id: string): Promise<WebdriverIO.Element> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();

    const $loader = await this.findBySelector('loader');
    await $loader.waitForExist({ reverse: true });

    const $$explorerItems = await this.findAllBySelector('item');

    for (const $explorerItem of $$explorerItems) {
      const $itemId = await $explorerItem.$('.MuiListItemText-secondary').getElement();
      const currentId = await $itemId.getText();

      if (currentId === id) {
        return $explorerItem;
      }
    }

    throw new Error('Не найден элемент с id ' + id);
  }

  async waitForDocumentTitle(id: string, expectedTitle: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        try {
          const $item = await this.getExplorerItemById(id);
          const $title = await $item.$('.Explorer-ItemTitle').getElement();
          const actualTitle = await $title.getText();

          return actualTitle === expectedTitle;
        } catch {
          return false;
        }
      },
      {
        timeout: 5000,
        timeoutMsg: `Документ с id ${id} не отображается с названием "${expectedTitle}"`
      }
    );
  }

  async clickEditButton(): Promise<void> {
    const $editButton = await $('button[aria-label="Редактировать"]').getElement();
    await $editButton.waitForDisplayed();
    await $editButton.click();
  }
}
