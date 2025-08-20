import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class LayersFilterBlock extends Block {
  selectors = {
    container: '.LayersFilter',
    filterInput: '.LayersFilter-Input'
  };

  async setFilterValue(filterValue: string): Promise<void> {
    await this.waitForVisible();

    const $field = await this.$('filterInput');

    if (!$field) {
      throw new Error('Не найдено поле фильтра');
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(filterValue);
  }
}

export const layersFilterBlock = new LayersFilterBlock();
