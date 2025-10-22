import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';

class FilesBlock extends Block {
  selectors = {
    container: '.Files'
  };

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
