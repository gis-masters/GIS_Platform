import { Block } from '../../Block';
import { ExplorerBlock } from '../Explorer/Explorer.block';
import { libraryDocumentVersionsActionsDialogBlock } from '../LibraryDocumentActionsRestoreDialog/LibraryDocumentActionsRestoreDialog.block';

class DocumentVersionsWidgetBlock extends Block {
  selectors = {
    container: '.DocumentVersionsWidget',
    closeDialog: '.DocumentVersionsWidget .MuiButton-outlined',
    restoreBtn: '.DocumentVersionsWidget .LibraryDocumentVersionsActions-Restore',
    documentVersionBtn: '.DocumentVersionsWidget-Button'
  };

  async clickDocumentVersionBtn(): Promise<void> {
    const $documentVersionBtn = await this.$('documentVersionBtn');
    await $documentVersionBtn.waitForDisplayed();
    await $documentVersionBtn.click();
  }

  async clickCloseDialogBtn(): Promise<void> {
    const $closeDialog = await this.$('closeDialog');
    await $closeDialog.waitForDisplayed();
    await $closeDialog.click();

    await $closeDialog.waitForDisplayed({ reverse: true });
  }

  async clickRestoreDocumentVersionBtn(): Promise<void> {
    await this.waitForVisible();

    const $documentVersionBtn = await this.$('restoreBtn');
    await $documentVersionBtn.waitForDisplayed();
    await $documentVersionBtn.click();

    await libraryDocumentVersionsActionsDialogBlock.clickAcceptRestoreBtn();
  }

  async restoreLastDocumentVersion(): Promise<void> {
    const $explorerBlock = new ExplorerBlock(await this.$('container'));
    await $explorerBlock.waitForLoading();
    await $explorerBlock.selectFirstExplorerItem();

    await this.clickRestoreDocumentVersionBtn();
  }

  async documentVersionBtnExist(): Promise<boolean> {
    const $documentVersionBtn = await this.$('documentVersionBtn');

    return await $documentVersionBtn.isExisting();
  }

  async restoreDocumentVersionBtnExist(): Promise<boolean> {
    await this.waitForVisible();

    const $explorerBlock = new ExplorerBlock(await this.$('container'));
    await $explorerBlock.waitForLoading();

    const $documentVersionBtn = await this.$('restoreBtn');

    return await $documentVersionBtn.isExisting();
  }

  async getPrevDocumentVersionTitleFieldValue(fieldName: string): Promise<string> {
    if (!(await this.getDocumentVersionLength())) {
      throw new Error('Неверное количество версий документа');
    }

    const explorerBlock = new ExplorerBlock(await this.$('container'));
    await explorerBlock.waitForExist();

    return await explorerBlock.getContentWidgetFieldValue(fieldName);
  }

  async isDocumentVersionSingle(): Promise<void> {
    if ((await this.getDocumentVersionLength()) !== 1) {
      throw new Error('Неверное количество версий документа');
    }
  }

  async getDocumentVersionLength(): Promise<number> {
    await this.waitForVisible();

    const explorerBlock = new ExplorerBlock(await this.$('container'));
    await explorerBlock.waitForExist();

    return await explorerBlock.getExplorerItemsLength();
  }
}

export const documentVersionsWidgetBlock = new DocumentVersionsWidgetBlock();
