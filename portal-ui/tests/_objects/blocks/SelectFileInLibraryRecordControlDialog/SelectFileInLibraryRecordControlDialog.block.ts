import { Block } from '../../Block';

class SelectFileInLibraryRecordControlDialogBlock extends Block {
  selectors = {
    container: '.SelectFileInLibraryRecordControl-Dialog',
    datasourceDialogAddBtn: '.SelectFileInLibraryRecordControl-Dialog .MuiButton-outlinedPrimary'
  };

  async selectVectorTableBtn(): Promise<void> {
    const $datasourceDialogAddBtn = await this.$('datasourceDialogAddBtn');
    await $datasourceDialogAddBtn.waitForDisplayed({ timeout: 3000 });

    await $datasourceDialogAddBtn.click();
  }
}

export const selectFileInLibraryRecordControlDialogBlock = new SelectFileInLibraryRecordControlDialogBlock();
