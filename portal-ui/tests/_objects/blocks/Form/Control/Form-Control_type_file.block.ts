import { Block } from '../../../Block';

class FormControlTypeFileBlock extends Block {
  selectors = {
    root: '.Form-Control_type_file',
    lookupList: '.Form-Control_type_file .Lookup-List',
    filesItem: '.Form-Control_type_file .Files-Item'
  };

  async isFilesPlacementBtnExist(title: string): Promise<boolean> {
    const $file = await this.findFileItem(title);
    const $addUserBtn = await $file.$('.Files-Placement').getElement();

    return await $addUserBtn.isExisting();
  }

  async isCompoundFileHaveSingleDeleteBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-Delete').getElements();

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleDownloadBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-DownloadCompoundFile').getElements();

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleFilesPlacementBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-Placement').getElements();

    return $$delete.length === 1;
  }

  async findFileItem(title: string): Promise<WebdriverIO.Element> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$items = await this.findAllBySelector('filesItem');

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
}

export const formControlTypeFileBlock = new FormControlTypeFileBlock();
