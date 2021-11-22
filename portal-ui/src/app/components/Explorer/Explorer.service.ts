import { boundMethod } from 'autobind-decorator';
import { action } from 'mobx';

import { getChildrenWithParticularOne, getId } from './Adapter/Explorer-Adapter';
import { ExplorerItemData } from './Explorer.models';
import { ExplorerStore } from './Explorer.store';

export class ExplorerService {
  private store: ExplorerStore;

  constructor(store: ExplorerStore) {
    this.store = store;
  }

  @action
  showRestoredItem(
    selectedItem: ExplorerItemData,
    children: ExplorerItemData[],
    pagesCount: number,
    i: number,
    page: number
  ): void {
    const { path } = this.store;
    path.splice(i === 1 ? i : i + 1, path.length);
    path[i - 1].children = children;
    if (i + 1 !== path.length) {
      path.push(selectedItem ? selectedItem : children[0]);
    }
    this.store.totalPages = pagesCount;
    this.store.selectItem(selectedItem ? selectedItem : children[0]);
    this.store.setPage(page ? page : 0);
  }

  @boundMethod
  async createHandler(itemData: ExplorerItemData): Promise<void> {
    const { page, pageSize, sort, sortDir, filter, path } = this.store;
    const response = await getChildrenWithParticularOne(
      path[path.length - 2],
      { page, pageSize, sort, sortDir, filter },
      [itemData.type, getId(itemData)]
    );

    const [children, pagesCount, childrenPage] = response;

    const selectedItem: ExplorerItemData = children.find(child => getId(child) === getId(itemData));

    this.showRestoredItem(selectedItem, children, pagesCount, path.length - 1, childrenPage ? childrenPage : page);
  }
}
