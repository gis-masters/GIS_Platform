import { boundMethod } from 'autobind-decorator';
import { debounce } from 'lodash';

import { getChildren, getChildrenWithParticularOne, getId } from './Adapter/Explorer-Adapter';
import { emptyItem, ExplorerItemData, ExplorerItemType } from './Explorer.models';
import { ExplorerStore } from './Explorer.store';

export class ExplorerService {
  private store: ExplorerStore;
  private gettingChildrenOperationId: symbol;

  constructor(store: ExplorerStore) {
    this.store = store;

    this.refreshItems = debounce(this.refreshItems.bind(this), 50);
  }

  async refreshItems(): Promise<void> {
    const { selectedItem, openedItem, pageSize, sort, sortOrder, filter } = this.store;
    let { page } = this.store;
    let children: ExplorerItemData[];
    let totalPages: number;

    this.store.setLoading(true);

    const gettingChildrenToken = Symbol();
    this.gettingChildrenOperationId = gettingChildrenToken;

    if (selectedItem.type === ExplorerItemType.EMPTY) {
      [children = [], totalPages = 0] = await getChildren(openedItem, {
        page,
        pageSize,
        sort,
        sortOrder,
        filter
      });
    } else {
      const response = await getChildrenWithParticularOne(
        openedItem,
        { page, pageSize, sort, sortOrder, filter },
        getId(selectedItem)
      );

      if (response) {
        [children = [], totalPages = 0, page = 0] = response;
      } else {
        [children = [], totalPages = 0] = await getChildren(openedItem, {
          page,
          pageSize,
          sort,
          sortOrder: sortOrder,
          filter
        });
      }
    }

    if (this.gettingChildrenOperationId === gettingChildrenToken) {
      this.store.setItems(children);
      this.store.setTotalPages(totalPages);
      if (selectedItem.type === ExplorerItemType.EMPTY || !children.some(item => this.itemsEqual(item, selectedItem))) {
        this.store.selectItem(children[0] || emptyItem);
      } else {
        this.store.setPage(page);
        this.store.selectItem(children.find(item => this.itemsEqual(item, selectedItem)));
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
    return a && b && getId(a) === getId(b) && a.type === b.type;
  }
}
