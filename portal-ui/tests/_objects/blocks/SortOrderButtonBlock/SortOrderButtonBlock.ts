import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../Block';
import { hasClass } from '../../utils/hasClass';

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

    const isAsc = await hasClass($filterInputStrictness, 'SortOrderButton_asc');
    const isDesc = await hasClass($filterInputStrictness, 'SortOrderButton_desc');
    if (isAsc) {
      return SortOrder.ASC;
    } else if (isDesc) {
      return SortOrder.DESC;
    }

    throw new Error('Ошибка получения типа сортировки');
  }
}

export const sortOrderButtonBlock = new SortOrderButtonBlock();
