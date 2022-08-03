import { action, computed, observable, makeObservable } from 'mobx';

import { SortOrder } from '../../services/models';

import { ExplorerItemData, pageSizeVariants, SortItem } from './Explorer.models';

export class ExplorerStore {
  readonly id: string;
  readonly pageSizeStorageKey: string;
  @observable path: ExplorerItemData[] = [];
  @observable items: ExplorerItemData[] = [];
  @observable pageSize = 10;
  @observable private _page = 0;
  @observable totalPages = 0;
  @observable sortItems: SortItem[] = [];
  @observable sort = '';
  @observable sortOrder: SortOrder = SortOrder.ASC;
  @observable filter: Record<string, string> = {};
  @observable loading = false;
  @observable restoringFromUrl = false;

  constructor(id: string) {
    makeObservable(this);
    this.id = id;
    this.pageSizeStorageKey = 'ExplorerPageSize' + id;
    const storedSize = Number(localStorage.getItem(this.pageSizeStorageKey));
    if (pageSizeVariants.includes(storedSize) && this.pageSize !== storedSize) {
      this.setPageSize(storedSize);
    }
  }

  @computed
  get selectedItem(): ExplorerItemData {
    const { path } = this;

    return path[path.length - 1];
  }

  @computed
  get openedItem(): ExplorerItemData {
    const { path } = this;

    return path.length > 1 ? path[path.length - 2] : path[0];
  }

  @computed
  get page(): number {
    if (this._page < 0) {
      return 0;
    }
    if (this._page > this.totalPages) {
      return this.totalPages;
    }

    return this._page;
  }

  @action
  setPath(path: ExplorerItemData[]): void {
    this.path = path;
  }

  @action
  selectItem(item: ExplorerItemData): void {
    this.path[this.path.length - 1] = item;
  }

  @action
  setItems(items: ExplorerItemData[]): void {
    this.items = items;
  }

  @action
  setSortItems(items?: SortItem[]): void {
    this.sortItems = items || [];
  }

  @action
  setSort(sort?: string): void {
    this.sort = sort || '';
  }

  @action
  setSortOrder(order?: SortOrder): void {
    this.sortOrder = order || SortOrder.ASC;
  }

  @action
  setPage(page: number): void {
    this._page = page;
  }

  @action
  setFilter(filter: { [key: string]: string }): void {
    this.filter = filter;
  }

  @action
  setPageSize(size: number): void {
    this.pageSize = size;
  }

  @action
  setTotalPages(totalPages: number): void {
    this.totalPages = totalPages;
  }

  @action
  setLoading(loading: boolean): void {
    this.loading = loading;
  }

  @action
  setRestoringFromUrl(status: boolean): void {
    this.restoringFromUrl = status;
  }
}
