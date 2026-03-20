import { Block } from '../../classes/Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class FilesBlock extends Block {
  selectors = {
    root: '.Files',
    list: '.Files .Lookup-List',
    item: '.Files-Item',
    placement: '.Files-Placement'
  };

  async isFilesPlacementBtnExist(title: string): Promise<boolean> {
    const $file = await this.findFileItem(title);
    const $filePlacementBtn = await $file.$(this.selectors.placement).getElement();

    return await $filePlacementBtn.isExisting();
  }

  async clickFilesPlacementBtn(title: string): Promise<void> {
    await this.isFilesPlacementBtnExist(title);

    const $file = await this.findFileItem(title);
    const $filePlacementBtn = await $file.$(this.selectors.placement).getElement();

    await $filePlacementBtn.click();
  }

  async isCompoundFileHaveSingleDeleteBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('list');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-Delete').getElements();

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleDownloadBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('list');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-DownloadCompoundFile').getElements();

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleFilesPlacementBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('list');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$(this.selectors.placement).getElements();

    return $$delete.length === 1;
  }

  async findFileItem(title: string): Promise<WebdriverIO.Element> {
    const $lookupList = await this.findBySelector('list');
    await $lookupList.waitForDisplayed();

    const $$items = await this.findAllBySelector('item');

    for (const $item of $$items) {
      const $itemBaseName = await $item.$('.Files-BaseName').getElement();
      const $itemExt = await $item.$('.Files-Ext').getElement();

      const itemBaseName = await $itemBaseName.getText();
      const itemExt = await $itemExt.getText();

      if (itemBaseName + itemExt === title) {
        return $item;
      }
    }

    throw new Error(`Файл "${title}" не найден`);
  }

  async clickPlaceFileBtn(fileName: string, field: string) {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForExist();

    const $field = await explorerBlock.getContentWidgetField(field);
    const $$items = await $field.$$('.Lookup-Item').getElements();

    for (const $item of $$items) {
      const $itemBaseName = await $item.$('.Files-BaseName').getElement();
      const $itemExt = await $item.$('.Files-Ext').getElement();
      const itemBaseName = await $itemBaseName.getText();
      const itemExt = await $itemExt.getText();

      if (itemBaseName + itemExt === fileName) {
        const $filePlacement = await $item.$('.Files-Placement').getElement();
        await $filePlacement.click();

        break;
      }
    }
  }
}

export const filesBlock = new FilesBlock();
