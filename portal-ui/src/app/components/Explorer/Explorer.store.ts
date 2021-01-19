import { action, computed, observable } from 'mobx';

import { SortDir } from '../../services/models';

import { ExplorerItemData, SortItem } from './Explorer.models';

export class ExplorerStore {
  @observable path: ExplorerItemData[] = [];
  @observable disabledItems: ExplorerItemData[] = [];
  @observable pageSize = 10;
  @observable page = 0;
  @observable totalPages = 0;
  @observable sortItems: SortItem[] = [];
  @observable sort = '';
  @observable sortDir: SortDir = SortDir.ASC;
  @observable filter: { [key: string]: string } = {};

  @computed
  get selectedItem(): ExplorerItemData {
    const { path } = this;

    return path[path.length - 1];
  }

  @computed
  get currentItem(): ExplorerItemData {
    const { path } = this;

    if (path.length > 1) {
      return path[path.length - 2];
    } else {
      return path[0];
    }
  }

  @action
  setPath(path: ExplorerItemData[]) {
    this.path = path;
  }

  @action
  selectItem(item: ExplorerItemData) {
    this.path[this.path.length - 1] = item;
  }

  @action
  setSortItems(items?: SortItem[]) {
    this.sortItems = items || [];
  }

  @action
  setSort(sort?: string) {
    this.sort = sort || '';
  }

  @action
  setSortDir(dir?: SortDir) {
    this.sortDir = dir || SortDir.ASC;
  }

  @action
  setPage(page: number) {
    this.page = page;
  }

  @action
  setFilter(filter: { [key: string]: string }) {
    this.filter = filter;
  }
}
