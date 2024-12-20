import { Block } from '../../Block';
import { libraryDocumentActionsDeleteDialogBlock } from '../LibraryDocumentActionsDeleteDialog/LibraryDocumentActionsDeleteDialog.block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';
import { xTableFilterTypeIdBlock } from '../XTable/Filter/_type/XTable-Filter_type_id.block';
import { XTableBlock, xTableBlock } from '../XTable/XTable.block';

class LibraryRegistryBlock extends Block {
  selectors = {
    container: '.LibraryRegistry',
    loading: '.LibraryRegistry .Loading'
  };

  xTable = new XTableBlock(this.selectors.container);

  async getVisibleDocumentsIds(): Promise<number[]> {
    await this.waitForVisible();
    const colValues = await xTableBlock.getSecondColValues();

    return colValues.map(Number);
  }

  async setIdFilter(value: string): Promise<void> {
    await xTableFilterTypeIdBlock.setValue(value);
  }

  async restoreDocument(value: string, field: string, action: string): Promise<void> {
    await this.waitForVisible();
    await this.selectDocMenuAction(value, field, action);
  }

  async deleteDocument(value: string, field: string): Promise<void> {
    await this.selectDocMenuAction(value, field, 'Удалить');

    await libraryDocumentActionsDeleteDialogBlock.delete();
  }

  async selectDocMenuAction(value: string, field: string, action: string): Promise<void> {
    await xTableBlock.waitForLoading();
    const $documentRow = await xTableBlock.getRowByFieldValue(value, field);

    const $xTableDocumentRowSelect = await $documentRow.$('.LibraryRegistry-Actions');
    await $xTableDocumentRowSelect.click();

    const muiSelect = new MuiMenuBlock();
    await muiSelect.clickItemByTitle(action);
  }

  async selectRowItem(value: string, field: string): Promise<void> {
    await xTableBlock.waitForLoading();
    const $documentRow = await xTableBlock.getRowByFieldValue(value, field);

    const $xTableDocumentRowSelect = await $documentRow.$('td:first-child input');
    await $xTableDocumentRowSelect.click();
  }

  async isDocumentExist(value: string, field: string): Promise<boolean> {
    await xTableBlock.waitForLoading();
    const $documentRow = await xTableBlock.getRowByFieldValue(value, field);

    return !!$documentRow;
  }
}

export const libraryRegistryBlock = new LibraryRegistryBlock();
