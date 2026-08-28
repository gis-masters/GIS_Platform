import { boundMethod } from 'autobind-decorator';
import { cloneDeep, debounce, type DebouncedFunc } from 'lodash';

import { type DataChangeEventDetail } from '../../services/communication.service';
import { type FilterQuery } from '../../services/util/filters/filters.models';
import { getChildren, getChildrenWithParticularOne, getId, wrapCreatedChild } from './Adapter/Explorer-Adapter';
import { emptyItem, type ExplorerItemData, ExplorerItemType } from './Explorer.models';
import { type ExplorerStore } from './Explorer.store';

export class ExplorerService {
  private store: ExplorerStore;
  private gettingChildrenOperationId?: symbol;
  private debouncedRefreshItems: DebouncedFunc<() => Promise<void>>;

  constructor(store: ExplorerStore) {
    this.store = store;
    this.debouncedRefreshItems = debounce(this._refreshItems.bind(this), 50);
  }

  @boundMethod
  refreshItems(e?: CustomEvent<DataChangeEventDetail<unknown>>): ReturnType<DebouncedFunc<() => Promise<void>>> {
    this.applyChangeEvent(e);

    return this.debouncedRefreshItems();
  }

  private async _refreshItems(): Promise<void> {
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

    const titleFilter = filterCopy?.title;
    if (typeof titleFilter === 'string' && titleFilter.length > 0) {
      filterCopy.title = { $ilike: `%${titleFilter}%` };
    } else {
      delete filterCopy.title;
    }

    if (store.customFilters[item.type]) {
      filterCopy = { ...filterCopy, ...store.customFilters[item.type] };
    }

    return filterCopy || undefined;
  }

  private applyChangeEvent(e?: CustomEvent<DataChangeEventDetail<unknown>>): void {
    const detail = e?.detail;
    if (!detail) {
      return;
    }

    const selectedBefore = this.store.selectedItem;

    if (detail.type === 'delete') {
      this.applyDeletedItem(detail.data);
    } else if (detail.type === 'create') {
      this.applyCreatedItem(detail.data);
    }

    if (this.store.selectedItem !== selectedBefore) {
      this.gettingChildrenOperationId = Symbol();
    }
  }

  private applyDeletedItem(data: unknown): void {
    const deletingItemId = getId(
      {
        type: this.store.selectedItem.type,
        payload: data
      } as ExplorerItemData,
      this.store
    );
    if (deletingItemId !== getId(this.store.selectedItem, this.store)) {
      return;
    }

    const selectedItemIndex = this.store.items.findIndex(item => getId(item, this.store) === deletingItemId);
    this.store.selectItem(
      this.store.items[selectedItemIndex + 1] || this.store.items[selectedItemIndex - 1] || emptyItem
    );
  }

  private applyCreatedItem(data: unknown): void {
    const created = wrapCreatedChild(this.store.openedItem, data, this.store);
    if (created) {
      this.store.selectItem(created);
    }
  }
}
