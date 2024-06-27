import { Block } from '../../Block';

class MapToolbarBlock extends Block {
  selectors = {
    container: '.MapToolbar',
    cancelSelection: '.MapToolbar .MapSelection-Cancel',
    selectMultiple: '.MapToolbar .MapSelection-Select'
  };

  async isCancelSelectionBtnExist(): Promise<boolean> {
    const $cancelSelectionBtn = await this.$('cancelSelection');

    return await $cancelSelectionBtn.isExisting();
  }

  async clickCancelSelectionBtn(): Promise<void> {
    const $cancelSelectionBtn = await this.$('cancelSelection');
    await $cancelSelectionBtn.waitForClickable();
    await $cancelSelectionBtn.click();
  }

  async clickSelectMultipleBtn(): Promise<void> {
    const $selectMultipleBtn = await this.$('selectMultiple');
    await $selectMultipleBtn.waitForClickable();
    await $selectMultipleBtn.click();
  }
}

export const mapToolbarBlock = new MapToolbarBlock();
