import { Block } from '../../Block';

class LibraryDocumentVersionsActionsDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentVersionsActionsRestore-Dialog',
    acceptRestoreBtn: '.LibraryDocumentVersionsActionsRestore-Dialog .MuiButton-outlinedPrimary'
  };

  async clickAcceptRestoreBtn(): Promise<void> {
    const $acceptRestoreBtn = await this.findBySelector('acceptRestoreBtn');
    await $acceptRestoreBtn.waitForDisplayed();
    await $acceptRestoreBtn.click();

    await $acceptRestoreBtn.waitForExist({ reverse: true });
  }
}

export const libraryDocumentVersionsActionsDialogBlock = new LibraryDocumentVersionsActionsDialogBlock();
