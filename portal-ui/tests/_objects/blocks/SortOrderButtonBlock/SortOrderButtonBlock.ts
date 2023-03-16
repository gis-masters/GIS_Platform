import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../Block';

class SortOrderButtonBlock extends Block {
  selectors = {
    container: '.SortOrderButton',
    sortOrderButtonAsc: '.Projects .SortOrderButton_asc'
  };

  async setSortOrder(direction: SortOrder) {
    const currentSortOrder = await this.getSortOrder();

    if (currentSortOrder && currentSortOrder !== direction) {
      const $sortOrderBtn = await this.$('container');
      await $sortOrderBtn.click();
    }
  }

  async getSortOrder(): Promise<SortOrder> {
    const $filterInputStrictness = await this.$('container');
    const cls = await $filterInputStrictness.getAttribute('class');

    if (!cls) {
      throw new Error('Ошибка получения классов кнопки сортировки');
    }

    if (cls.split(' ').includes('SortOrderButton_asc')) {
      return SortOrder.ASC;
    } else if (cls.split(' ').includes('SortOrderButton_desc')) {
      return SortOrder.DESC;
    }

    throw new Error('Ошибка получения типа сортировки');
  }
}

export const sortOrderButtonBlock = new SortOrderButtonBlock();
