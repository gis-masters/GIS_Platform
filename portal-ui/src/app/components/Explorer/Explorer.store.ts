import { action, computed, observable } from 'mobx';

import { SortDir } from '../../services/models';

import { ExplorerItemData, pageSizeVariants, SortItem } from './Explorer.models';

export class ExplorerStore {
  readonly id: string;
  readonly pageSizeStorageKey: string;
  @observable path: ExplorerItemData[] = [];
  @observable disabledItems: ExplorerItemData[] = [];
  @observable pageSize = 10;
  @observable page = 0;
  @observable totalPages = 0;
  @observable sortItems: SortItem[] = [];
  @observable sort = '';
  @observable sortDir: SortDir = SortDir.ASC;
  @observable filter: Record<string, string> = {};

  constructor(id: string) {
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

  @action
  setPath(path: ExplorerItemData[]): void {
    this.path = path;
  }

  @action
  setPathItem(item: ExplorerItemData, i: number): void {
    this.path[i] = item;
  }

  @action
  selectItem(item: ExplorerItemData): void {
    this.path[this.path.length - 1] = item;
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
  setSortDir(dir?: SortDir): void {
    this.sortDir = dir || SortDir.ASC;
  }

  @action
  setPage(page: number): void {
    this.page = page;
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
  setDisabledItems(disabledItems: ExplorerItemData[]): void {
    this.disabledItems = disabledItems;
  }
}
