import { Block } from '../../Block';

class MapToolbarBlock extends Block {
  selectors = {
    container: '.MapToolbar',
    cancelSelection: '.MapToolbar .MapSelection-Cancel'
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
}

export const mapToolbarBlock = new MapToolbarBlock();
