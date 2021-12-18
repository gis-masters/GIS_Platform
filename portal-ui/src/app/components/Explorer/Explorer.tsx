import React, { Component, CSSProperties } from 'react';
import { action, IReactionDisposer, observable, reaction, when } from 'mobx';
import { observer } from 'mobx-react';
import { cloneDeep, isEqual } from 'lodash';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { NavigationStart, RouterEvent } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { route } from '../../stores/Route.store';
import { Loading } from '../Loading/Loading';
import { Emitter } from '../../services/common/Emitter';
import { services } from '../../services/services';
import { SortDir } from '../../services/models';
import { Toast } from '../Toast/Toast';

import { ExplorerStore } from './Explorer.store';
import { emptyItem, ExplorerItemData, ExplorerItemType, KeyAction, keyActions } from './Explorer.models';
import {
  getChildren,
  getChildById,
  getChildrenSortDefaultDirection,
  getChildrenSortDefaultValue,
  getChildrenSortItems,
  getId,
  getChildrenWithParticularOne,
  getRefreshEmitters,
  isFolder
} from './Adapter/Explorer-Adapter';
import { ExplorerPagination } from './Pagination/Explorer-Pagination';
import { ExplorerToolbar } from './Toolbar/Explorer-Toolbar';
import { ExplorerTitle } from './Title/Explorer-Title';
import { ExplorerList } from './List/Explorer-List';
import { ExplorerInfo } from './Info/Explorer-Info';
import { ExplorerService } from './Explorer.service';

import '!style-loader!css-loader!sass-loader!./Explorer.scss';

export type ExplorerUrlItem = [ExplorerItemType, string, number?];
// pageSize, sort, sortDir, filter
export type ExplorerUrlOptions = [number, string, SortDir, Record<string, string>];

const cnExplorer = cn('Explorer');

const presets: Partial<{ [key in ExplorerItemType]: ExplorerItemData }> = {
  [ExplorerItemType.ROOT]: { type: ExplorerItemType.ROOT, payload: null },
  [ExplorerItemType.DATASET_ROOT]: { type: ExplorerItemType.DATASET_ROOT, payload: null },
  [ExplorerItemType.LIBRARY_ROOT]: { type: ExplorerItemType.LIBRARY_ROOT, payload: null },
  [ExplorerItemType.PROJECTS_ROOT]: { type: ExplorerItemType.PROJECTS_ROOT, payload: null },
  [ExplorerItemType.BASEMAPS_ROOT]: { type: ExplorerItemType.BASEMAPS_ROOT, payload: null }
};

export interface ExplorerProps extends IClassNameProps {
  appRole: string;
  title?: string;
  items?: ExplorerItemData[]; // [0] - root
  preset?: keyof typeof presets;
  disabledItems?: ExplorerItemData[];
  withInfoPanel?: boolean;
  withoutTitle?: boolean;
  fixedHeight?: boolean;
  urlChangeEnabled?: boolean;
  onSelect?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
  onOpen?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
}

@observer
export class Explorer extends Component<ExplorerProps> {
  @observable private busy = false;

  private urlChangeEnabled = false;
  private gettingChildrenToken: symbol;
  private onSelectReactionDispose: IReactionDisposer;
  private onPathReactionDispose: IReactionDisposer;
  private onOptionsReactionDispose: IReactionDisposer;
  private store: ExplorerStore;
  private service: ExplorerService;
  private subscribedRefreshEmitterTypes: ExplorerItemType[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(props: ExplorerProps) {
    super(props);
    this.store = new ExplorerStore(props.appRole);
    this.service = new ExplorerService(this.store);
    this.init(props);
  }

  async componentDidMount() {
    // кнопка вернуться назад
    services.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(async (event: RouterEvent) => {
      if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
        const url = new URL(location.origin + event.url);
        const explorerPath = url.searchParams.get(`explorerPath_${this.props.appRole}`);
        await this.restoreState(explorerPath);
      }
    });

    this.onSelectReactionDispose = reaction(
      () => this.store.selectedItem,
      selectedItem => {
        if (this.props.onSelect) {
          this.props.onSelect(selectedItem, this.store.path);
        }
      }
    );

    this.onPathReactionDispose = reaction(
      () => [cloneDeep(this.store.path), this.store.page],
      async () => {
        await this.setPathToUrl();
        await this.setOptionsToUrl();
      }
    );

    this.onOptionsReactionDispose = reaction(
      () => [this.store.pageSize, this.store.sort, this.store.sortDir, cloneDeep(this.store.filter)],
      async () => {
        await this.setOptionsToUrl();
      }
    );

    if (route.queryParams[`explorerPath_${this.props.appRole}`]) {
      await this.restoreState(route.queryParams['explorerPath_' + this.props.appRole]);
    }

    await when(() => !this.busy);
    this.urlChangeEnabled = true;
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.onSelectReactionDispose();
    this.onPathReactionDispose();
    this.onOptionsReactionDispose();
    Emitter.scopeOff(this);
  }

  componentDidUpdate(prevProps: ExplorerProps) {
    if (!isEqual(prevProps, this.props)) {
      this.init({ ...this.props });
    }
  }

  render() {
    const { withInfoPanel, fixedHeight, withoutTitle, className } = this.props;

    return (
      <div
        className={cnExplorer({ withInfoPanel }, [className])}
        onKeyDown={this.keyDownHandler}
        tabIndex={0}
        style={{ '--ExplorerPageSize': fixedHeight ? this.store.pageSize : 0 } as CSSProperties}
      >
        {!withoutTitle && <ExplorerTitle store={this.store} onOpen={this.openItem} />}
        <ExplorerList store={this.store} onOpen={this.openItem} />
        <ExplorerToolbar service={this.service} store={this.store} onChange={this.handleQueryChange} />
        {withInfoPanel && <ExplorerInfo store={this.store} Explorer={Explorer} />}
        <ExplorerPagination store={this.store} onChange={this.paginate} />
        <Loading visible={this.busy} noBackdrop />
      </div>
    );
  }

  private init(props: ExplorerProps) {
    const { items, title, preset, disabledItems } = props;

    if (preset) {
      this.store.setPath([presets[preset]]);
    } else {
      this.store.setPath([
        { type: ExplorerItemType.EMPTY, payload: { title }, children: items },
        items.length ? items[0] : emptyItem
      ]);
    }

    this.store.setDisabledItems(disabledItems || []);
  }

  @boundMethod
  private async openItem(item: ExplorerItemData, page: number, depth?: number, updateFilters?: boolean) {
    if (item.type === ExplorerItemType.EMPTY) {
      return;
    }

    if (this.props.onOpen) {
      this.props.onOpen(item, this.store.path);
    }

    if (!isFolder(item)) {
      return;
    }

    if (depth !== this.store.path.length - 2) {
      this.store.setSort(getChildrenSortDefaultValue(item));
      this.store.setSortItems(getChildrenSortItems(item));
      this.store.setFilter({});
      if (updateFilters) {
        this.store.setSortDir(getChildrenSortDefaultDirection(item));
      }
    }

    this.store.selectItem(item);
    this.setBusy(true);

    const { pageSize, sort, sortDir, filter } = this.store;
    const gettingChildrenToken = Symbol();
    this.gettingChildrenToken = gettingChildrenToken;

    const [children, pagesCount] = await getChildren(item, { page, pageSize, sort, sortDir, filter });

    if (gettingChildrenToken === this.gettingChildrenToken) {
      children.forEach(child => {
        if (!this.subscribedRefreshEmitterTypes.includes(child.type)) {
          this.subscribedRefreshEmitterTypes.push(child.type);

          getRefreshEmitters(child).forEach(emitter => {
            emitter.on(this.refresh, this);
          });
        }
      });

      this.store.setPage(page);
      this.setChildren(item, children, pagesCount, depth);
    }

    this.setBusy(false);
  }

  @boundMethod
  private keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    if (document.querySelector('input:focus,textarea:focus')) {
      return;
    }

    const { path, selectedItem, openedItem: currentItem, page, totalPages } = this.store;
    const action = Object.keys(keyActions).find(key => keyActions[key].includes(e.key));

    if (action === KeyAction.BACK && path.length >= 3) {
      void this.openItem(path[path.length - 3], 0, path.length - 3);
    }

    if (action === KeyAction.PAGE_PREV && page > 0) {
      this.paginate(page - 1);
    }

    if (action === KeyAction.PAGE_NEXT && page < totalPages - 1) {
      this.paginate(page + 1);
    }

    if (action === KeyAction.PREV || action === KeyAction.NEXT) {
      const currentSelectionId = getId(selectedItem);
      const currentSelectionIndex = currentItem.children.findIndex(item => getId(item) === currentSelectionId);

      const newSelectionIndex = action === KeyAction.NEXT ? currentSelectionIndex + 1 : currentSelectionIndex - 1;

      if (newSelectionIndex >= 0 && newSelectionIndex < currentItem.children.length) {
        this.store.selectItem(currentItem.children[newSelectionIndex]);
      }
    }

    if (action === KeyAction.OPEN) {
      void this.openItem(selectedItem, 0);
    }
  }

  @boundMethod
  private paginate(page: number) {
    const { path, openedItem: currentItem } = this.store;
    void this.openItem(currentItem, page, path.length - 2);
  }

  @boundMethod
  private handleQueryChange() {
    const { path, openedItem: currentItem } = this.store;
    void this.openItem(currentItem, 0, path.length - 2);
  }

  @action
  private setChildren(item: ExplorerItemData, children: ExplorerItemData[], pagesCount: number, depth?: number) {
    if (typeof depth === 'number') {
      this.store.path.splice(depth + 1, this.store.path.length);
    }

    item.children = children;
    this.store.path.push(children[0] || emptyItem);
    this.store.totalPages = pagesCount;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @boundMethod
  private refresh() {
    const { store } = this;
    void this.openItem(store.openedItem, 0, store.path.length - 2);
  }

  private async setPathToUrl() {
    if (!this.urlChangeEnabled || !this.props.urlChangeEnabled) {
      return;
    }

    if (this.store.path[this.store.path.length - 1] === this.store.path[this.store.path.length - 2]) {
      return;
    }

    await services.provided;

    const explorerItems: ExplorerUrlItem[] = this.store.path?.map((path, i) => {
      const id = getId(path);

      const res: ExplorerUrlItem = [path.type, id];

      if (i === this.store.path.length - 1) {
        res[2] = this.store.page;
      }

      return res;
    });

    const encodedURIPath = JSON.stringify(explorerItems);

    const { appRole } = this.props;

    await services.router.navigate([location.pathname], {
      queryParams: {
        ['explorerPath_' + appRole]: encodedURIPath
      },
      queryParamsHandling: 'merge'
    });
  }

  private async setOptionsToUrl() {
    if (!this.urlChangeEnabled || !this.props.urlChangeEnabled) {
      return;
    }
    await services.provided;

    const { pageSize, sort, sortDir, filter } = this.store;
    const explorerOptions: ExplorerUrlOptions = [pageSize, sort, sortDir, filter];
    const encodedURIOptions = JSON.stringify(explorerOptions);

    const { appRole } = this.props;

    await services.router.navigate([location.pathname], {
      queryParams: {
        ['explorerOptions_' + appRole]: encodedURIOptions
      },
      queryParamsHandling: 'merge'
    });
  }

  private async restoreState(urlExplorersPath: string) {
    this.urlChangeEnabled = false;

    this.restoreOptions();

    const explorersPath = JSON.parse(urlExplorersPath) as ExplorerUrlItem[];

    for (let i = 1; i < explorersPath.length; i++) {
      await (i === explorersPath.length - 1
        ? this.restoreLastItem(explorersPath[i], i)
        : this.restoreItem(explorersPath[i], i));
    }

    this.urlChangeEnabled = true;
  }

  private async restoreItem(urlItem: ExplorerUrlItem, i: number) {
    const [type, id] = urlItem;
    const childrenItem = await getChildById(this.store.path[i - 1], id, type);

    if (!childrenItem) {
      await this.openItem(this.store.path[i - 1], 0, i - 1, false);
    } else {
      this.store.setPathItem(childrenItem, i);
    }
  }

  private async restoreLastItem(urlItem: ExplorerUrlItem, i: number) {
    const [type, id, page] = urlItem;
    const { pageSize, sort, sortDir, filter, path } = this.store;

    if (!path[i - 1]) {
      await this.openItem(path[path.length - 1], 0, path.length - 1, false);
    } else if (type !== ExplorerItemType.EMPTY) {
      const response =
        type && id
          ? await getChildrenWithParticularOne(path[i - 1], { page, pageSize, sort, sortDir, filter }, urlItem)
          : await getChildren(path[i - 1], { page, pageSize, sort, sortDir, filter });

      if (response) {
        const [children, pagesCount, childrenPage] = response;

        const selectedItem: ExplorerItemData = children.find(item => item.type === type && getId(item) === id);
        this.service.showRestoredItem(selectedItem, children, pagesCount, i, childrenPage ? childrenPage : page);
      } else {
        if (i > 1 && id) {
          Toast.warn({ message: 'Объект не найден' });
        }

        await this.openItem(path[i - 1], 0, i - 1, false);
      }
    } else {
      await this.openItem(path[i - 1], 0, i - 1, false);
    }
    this.store.setSortItems(getChildrenSortItems(path[path.length - 2]));
  }

  private restoreOptions() {
    const queryParam = route.queryParams['explorerOptions_' + this.props.appRole];
    if (!queryParam) {
      return;
    }

    const [pageSize, sort, sortDir, filter] = JSON.parse(
      route.queryParams['explorerOptions_' + this.props.appRole]
    ) as ExplorerUrlOptions;

    this.store.setPageSize(pageSize);
    this.store.setSort(sort);
    this.store.setSortDir(sortDir);
    this.store.setFilter(filter);
  }
}
