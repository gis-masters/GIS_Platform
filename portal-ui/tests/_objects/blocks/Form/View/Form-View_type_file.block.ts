import { Block } from '../../../Block';

class FormViewTypeFileBlock extends Block {
  selectors = {
    container: '.Form-View_type_file',
    lookupList: '.Form-View_type_file .Lookup-List',
    filesItem: '.Form-View_type_file .Files-Item'
  };

  async isCompoundFileHaveSingleDownloadBtn(): Promise<boolean> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-DownloadCompoundFile');

    return $$delete.length === 1;
  }

  async isCompoundFileHaveSingleFilesPlacementBtn(): Promise<boolean> {
    const $lookupList = await this.$('lookupList');
    await $lookupList.waitForDisplayed();

    const $$delete = await $lookupList.$$('.Files-Placement');

    return $$delete.length === 1;
  }
}

export const formViewTypeFileBlock = new FormViewTypeFileBlock();
