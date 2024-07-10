import { action, computed, makeObservable, observable } from 'mobx';

import { SortOrder } from '../../services/models';
import { Adapter, CustomFilters, ExplorerItemData, ExplorerRole, pageSizeVariants, SortItem } from './Explorer.models';

export class ExplorerStore {
  readonly explorerRole: ExplorerRole;
  readonly pageSizeStorageKey: string;
  @observable path: ExplorerItemData[] = [];
  @observable items: ExplorerItemData[] = [];
  @observable pageSize = 10;
  @observable private _page = 0;
  @observable totalPages = 0;
  @observable sortItems: SortItem[] = [];
  @observable customFilters: CustomFilters = {};
  @observable sort?: string;
  @observable sortOrder: SortOrder = SortOrder.ASC;
  @observable filter: Record<string, string> = {};
  @observable adaptersOverride: Record<string, Partial<Adapter>> = {};
  @observable loading = false;
  @observable restoringFromUrl = false;

  constructor(explorerRole: ExplorerRole = '') {
    makeObservable(this);
    this.explorerRole = explorerRole;
    this.pageSizeStorageKey = 'ExplorerPageSize' + explorerRole;
    const storedSize = Number(localStorage.getItem(this.pageSizeStorageKey));
    if (pageSizeVariants.includes(storedSize) && this.pageSize !== storedSize) {
      this.setPageSize(storedSize);
    }
  }

  @computed
  get selectedItem(): ExplorerItemData {
    const { path } = this;

    const selectedItem = path.at(-1);

    if (!selectedItem) {
      throw new Error('Selection error');
    }

    return selectedItem;
  }

  @computed
  get openedItem(): ExplorerItemData {
    const { path } = this;
    const openedItem = path.at(-2);
    const firstItem = path[0];

    return path.length > 1 && openedItem ? openedItem : firstItem;
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
  setCustomFilters(customFilters: CustomFilters): void {
    this.customFilters = customFilters;
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
    this.sort = sort;
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

  @action
  setAdaptersOverride(adaptersOverride: Record<string, Partial<Adapter>>): void {
    this.adaptersOverride = adaptersOverride;
  }
}
