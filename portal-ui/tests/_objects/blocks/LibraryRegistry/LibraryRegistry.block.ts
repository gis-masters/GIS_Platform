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
}

export const libraryRegistryBlock = new LibraryRegistryBlock();
