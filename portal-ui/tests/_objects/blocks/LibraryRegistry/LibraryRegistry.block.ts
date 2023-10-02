import { Block } from '../../Block';
import { xTableFilterTypeIdBlock } from '../XTable/Filter/_type/XTable-Filter_type_id.block';
import { xTableBlock } from '../XTable/XTable.block';

class LibraryRegistryBlock extends Block {
  selectors = {
    container: '.LibraryRegistry'
  };

  async getVisibleDocumentsIds(): Promise<number[]> {
    const colValues = await xTableBlock.getSecondColValues();

    return colValues.map(Number);
  }

  async setIdFilter(value: string): Promise<void> {
    await xTableFilterTypeIdBlock.setValue(value);
  }

  async selectRowItem(value: string, field: string): Promise<void> {
    await xTableBlock.waitForLoading();
    const $documentRow = await xTableBlock.getRowByFieldValue(value, field);

    const $xTableDocumentRowSelect = await $documentRow.$('td:first-child input');
    await $xTableDocumentRowSelect.click();
  }
}

export const libraryRegistryBlock = new LibraryRegistryBlock();
