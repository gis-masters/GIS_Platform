import { Block } from '../../Block';

class LibraryDeletedDocumentRestoreDialogBlock extends Block {
  selectors = {
    container: '.LibraryDeletedDocumentRestoreDialog',
    select: '.LibraryDeletedDocumentRestoreDialog .MuiButton-outlinedPrimary',
    loading: '.LibraryDeletedDocumentRestoreDialog .Loading'
  };

  async selectFolder(): Promise<void> {
    await this.waitForVisible();

    const $loading = await this.$('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
    const $select = await this.$('select');
    await $select.waitForClickable();
    await $select.click();
    await $select.waitForDisplayed({ reverse: true });
  }
}

export const libraryDeletedDocumentRestoreDialogBlock = new LibraryDeletedDocumentRestoreDialogBlock();
