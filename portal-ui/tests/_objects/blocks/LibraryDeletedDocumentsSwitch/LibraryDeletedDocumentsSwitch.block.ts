import { Block } from '../../Block';

class LibraryDeletedDocumentsSwitchBlock extends Block {
  selectors = {
    container: '.LibraryDeletedDocumentsSwitch',
    loading: '.LibraryRegistry .Loading'
  };

  async deletedDocumentsSwitch(): Promise<void> {
    const $switch = await this.$('container');
    await $switch.waitForClickable();
    await $switch.click();

    const $loading = await this.$('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
  }
}

export const libraryDeletedDocumentsSwitchBlock = new LibraryDeletedDocumentsSwitchBlock();
