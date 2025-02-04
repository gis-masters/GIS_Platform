import { Block } from '../../Block';

class LibraryDocumentVersionsActionsDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentVersionsActionsRestore-Dialog',
    acceptRestoreBtn: '.LibraryDocumentVersionsActionsRestore-Dialog .MuiButton-outlinedPrimary'
  };

  async clickAcceptRestoreBtn(): Promise<void> {
    const $acceptRestoreBtn = await this.$('acceptRestoreBtn');
    await $acceptRestoreBtn.waitForDisplayed();
    await $acceptRestoreBtn.click();

    await $acceptRestoreBtn.waitForDisplayed({ reverse: true });
  }
}

export const libraryDocumentVersionsActionsDialogBlock = new LibraryDocumentVersionsActionsDialogBlock();
