import { Block } from '../../Block';

class LibraryDeletedDocumentsSwitchBlock extends Block {
  selectors = {
    root: '.LibraryDeletedDocumentsSwitch',
    loading: '.LibraryRegistry .Loading'
  };

  async deletedDocumentsSwitch(): Promise<void> {
    const $switch = await this.findBySelector('root');
    await $switch.waitForClickable();
    await $switch.click();

    const $loading = await this.findBySelector('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForExist({ reverse: true });
  }
}

export const libraryDeletedDocumentsSwitchBlock = new LibraryDeletedDocumentsSwitchBlock();
