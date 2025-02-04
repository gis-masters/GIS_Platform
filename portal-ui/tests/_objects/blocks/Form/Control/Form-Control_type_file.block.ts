import { Block } from '../../../Block';

class FormControlTypeFileBlock extends Block {
  selectors = {
    container: '.Form-Control_type_file',
    lookupList: '.Form-Control_type_file .Lookup-List',
    filesItem: '.Form-Control_type_file .Files-Item'
  };

  async isFilesPlacementBtnExist(title: string): Promise<boolean> {
    const $file = await this.findFileItem(title);
    const $addUserBtn = await $file.$('.Files-Placement');

    return await $addUserBtn.isExisting();
  }

  async isCompoundFileHaveSingleDeleteBtn(): Promise<boolean> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-Delete');

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleDownloadBtn(): Promise<boolean> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Lookup-DownloadCompoundFile');

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleFilesPlacementBtn(): Promise<boolean> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-Placement');

    return $$delete.length === 1;
  }

  async findFileItem(title: string): Promise<WebdriverIO.Element> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$items = await this.$$('filesItem');

    for (const $item of $$items) {
      const $itemBaseName = await $item.$('.Files-BaseName');
      const $itemExt = await $item.$('.Files-Ext');

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
