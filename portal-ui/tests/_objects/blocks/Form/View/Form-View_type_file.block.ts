import { Block } from '../../../Block';

class FormViewTypeFileBlock extends Block {
  selectors = {
    container: '.Form-View_type_file',
    lookupList: '.Form-View_type_file .Lookup-List',
    filesItem: '.Form-View_type_file .Files-Item'
  };

  async isCompoundFileHaveSingleDownloadBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-DownloadCompoundFile').getElements();

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleFilesPlacementBtn(): Promise<boolean> {
    const $lookupList = await this.findBySelector('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-Placement').getElements();

    return $$delete.length === 1;
  }
}

export const formViewTypeFileBlock = new FormViewTypeFileBlock();
