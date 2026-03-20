import { Block } from '../../classes/Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class LayersFilterBlock extends Block {
  selectors = {
    root: '.LayersFilter',
    filterInput: '.LayersFilter-Input'
  };

  async setFilterValue(filterValue: string): Promise<void> {
    await this.waitForVisible();

    const $field = await this.findBySelector('filterInput');

    if (!$field) {
      throw new Error('Не найдено поле фильтра');
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(filterValue);
  }
}

export const layersFilterBlock = new LayersFilterBlock();
