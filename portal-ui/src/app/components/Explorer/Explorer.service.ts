import { boundMethod } from 'autobind-decorator';
import { cloneDeep, debounce, DebouncedFunc } from 'lodash';

import { DataChangeEventDetail } from '../../services/communication.service';
import { FilterQuery } from '../../services/util/filters/filters.models';
import { getChildren, getChildrenWithParticularOne, getId } from './Adapter/Explorer-Adapter';
import { emptyItem, ExplorerItemData, ExplorerItemType } from './Explorer.models';
import { ExplorerStore } from './Explorer.store';

export class ExplorerService {
  private store: ExplorerStore;
  private gettingChildrenOperationId?: symbol;
  refreshItems: DebouncedFunc<(e?: CustomEvent<DataChangeEventDetail<unknown>>) => Promise<void>>;

  constructor(store: ExplorerStore) {
    this.store = store;
    this.refreshItems = debounce(this._refreshItems.bind(this), 50);
  }

  private async _refreshItems(e?: CustomEvent<DataChangeEventDetail<unknown>>): Promise<void> {
    if (e?.detail?.type === 'delete') {
      const deletingItemId = getId(
        {
          type: this.store.selectedItem.type,
          payload: e.detail.data
        } as ExplorerItemData,
        this.store
      );
      if (deletingItemId === getId(this.store.selectedItem, this.store)) {
        const selectedItemIndex = this.store.items.findIndex(item => getId(item, this.store) === deletingItemId);
        this.store.selectItem(
          this.store.items[selectedItemIndex + 1] || this.store.items[selectedItemIndex - 1] || emptyItem
        );
      }
    }

    const { selectedItem, openedItem, pageSize, sort, sortOrder, filter } = this.store;
    let { page } = this.store;
    let children: ExplorerItemData[] = [];
    let totalPages: number = 0;

    this.store.setLoading(true);

    const gettingChildrenToken = Symbol();
    this.gettingChildrenOperationId = gettingChildrenToken;

    if (selectedItem.type === ExplorerItemType.NONE) {
      const result = await getChildren(
        openedItem,
        {
          page,
          pageSize,
          sort,
          sortOrder,
          filter
        },
        this.store,
        this
      );
      if (result) {
        [children, totalPages = 0] = result;
      }
    } else {
      const response = await getChildrenWithParticularOne(
        openedItem,
        { page, pageSize, sort, sortOrder, filter },
        getId(selectedItem, this.store),
        this.store,
        this
      );

      if (response) {
        [children, totalPages, page] = response;
      } else {
        const result = await getChildren(
          openedItem,
          {
            page,
            pageSize,
            sort,
            sortOrder: sortOrder,
            filter
          },
          this.store,
          this
        );
        if (result) {
          [children, totalPages] = result;
        }
      }
    }

    if (this.gettingChildrenOperationId === gettingChildrenToken) {
      this.store.setItems(children);
      this.store.setTotalPages(totalPages);
      if (selectedItem.type === ExplorerItemType.NONE || !children.some(item => this.itemsEqual(item, selectedItem))) {
        this.store.selectItem(children[0] || emptyItem);
      } else {
        this.store.setPage(page);
        const foundSelectedItem = children.find(item => this.itemsEqual(item, selectedItem));
        if (!foundSelectedItem) {
          throw new Error('Ошибка выделения объекта');
        }
        this.store.selectItem(foundSelectedItem);
      }
      this.store.setLoading(false);
    }
  }

  @boundMethod
  paginate(page: number): void {
    if (this.store.page !== page) {
      this.store.selectItem(emptyItem);
      this.store.setPage(page);
    }
  }

  itemsEqual(a: ExplorerItemData, b: ExplorerItemData): boolean {
    return a && b && getId(a, this.store) === getId(b, this.store) && a.type === b.type;
  }

  mergeCustomFilter(filter: FilterQuery | undefined, item: ExplorerItemData, store: ExplorerStore): FilterQuery {
    let filterCopy: FilterQuery = cloneDeep(filter || {});

    if (filterCopy?.title) {
      filterCopy.title = { $ilike: `%${String(filterCopy.title)}%` };
    } else if (!filterCopy?.title) {
      delete filterCopy.title;
    }

    if (store.customFilters[item.type]) {
      filterCopy = { ...filterCopy, ...store.customFilters[item.type] };
    }

    return filterCopy || undefined;
  }
}
