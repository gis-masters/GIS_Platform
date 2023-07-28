import React, { Component, CSSProperties, ReactNode } from 'react';
import { IReactionDisposer, reaction, when } from 'mobx';
import { observer } from 'mobx-react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationStart, RouterEvent } from '@angular/router';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { chunk, cloneDeep, isEqual } from 'lodash';
import { boundMethod } from 'autobind-decorator';

import { Emitter } from '../../services/common/Emitter';
import { services } from '../../services/services';
import { sleep } from '../../services/util/sleep';
import { SortOrder } from '../../services/models';
import { Loading } from '../Loading/Loading';

import { ExplorerStore } from './Explorer.store';
import { ExplorerService } from './Explorer.service';
import {
  CustomFilters,
  emptyItem,
  ExplorerItemData,
  ExplorerItemType,
  ExplorerRole,
  KeyAction,
  keyActions,
  loadingItem
} from './Explorer.models';
import {
  getChildById,
  getChildrenSortDefaultOrder,
  getChildrenSortDefaultValue,
  getChildrenSortItems,
  getId,
  getRefreshEmitters,
  isFolder
} from './Adapter/Explorer-Adapter';
import { ExplorerBreadcrumb } from './Breadcrumbs/Explorer-Breadcrumb';
import { ExplorerPagination } from './Pagination/Explorer-Pagination';
import { ExplorerToolbar } from './Toolbar/Explorer-Toolbar';
import { ExplorerList } from './List/Explorer-List';
import { ExplorerInfo } from './Info/Explorer-Info';

import '!style-loader!css-loader!sass-loader!./Explorer.scss';

type ExplorerUrlItem = [ExplorerItemType, string];
// page, pageSize, sort, sortOrder, filter
type ExplorerUrlOptions = [number, number, string, SortOrder, Record<string, string>];

const cnExplorer = cn('Explorer');

const presets: Partial<{ [key in ExplorerItemType]: ExplorerItemData[] }> = {
  [ExplorerItemType.ROOT]: [{ type: ExplorerItemType.ROOT, payload: null }, emptyItem],
  [ExplorerItemType.DATASET_ROOT]: [{ type: ExplorerItemType.DATASET_ROOT, payload: null }, emptyItem],
  [ExplorerItemType.LIBRARY_ROOT]: [{ type: ExplorerItemType.LIBRARY_ROOT, payload: null }, emptyItem],
  [ExplorerItemType.PROJECTS_ROOT]: [{ type: ExplorerItemType.PROJECTS_ROOT, payload: null }, emptyItem],
  [ExplorerItemType.BASEMAPS_ROOT]: [{ type: ExplorerItemType.BASEMAPS_ROOT, payload: null }, emptyItem]
};

export interface ExplorerProps extends IClassNameProps {
  explorerRole?: ExplorerRole;
  title?: string;
  path?: ExplorerItemData[]; // [0] - root
  preset?: keyof typeof presets;
  withInfoPanel?: boolean;
  withoutTitle?: boolean;
  fixedHeight?: boolean;
  urlChangeEnabled?: boolean;
  libraryViewSwitch?: ReactNode;
  customFilters?: CustomFilters;
  onSelect?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
  onOpen?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
  disabledTester?(item: ExplorerItemData): Promise<boolean> | boolean;
}

@observer
export default class Explorer extends Component<ExplorerProps> {
  private urlChangeEnabled = false;
  private reactionDisposers: IReactionDisposer[] = [];
  private store: ExplorerStore;
  private service: ExplorerService;
  private channels: Emitter[] = [];
  private savingToUrl = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(props: ExplorerProps) {
    super(props);
    this.store = new ExplorerStore(props.explorerRole);
    this.service = new ExplorerService(this.store);
    this.store.setCustomFilters(props.customFilters || {});
    this.init(props);
  }

  async componentDidMount() {
    const { onSelect, urlChangeEnabled } = this.props;

    // назад и вперёд по истории браузера
    if (urlChangeEnabled) {
      services.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(async (event: RouterEvent) => {
        if (event instanceof NavigationStart && !this.store.restoringFromUrl && !this.savingToUrl) {
          const url = new URL(location.origin + event.url);
          await this.restoreStateFromUrl(url);
        }
      });
    }

    let prevOpenedItem: ExplorerItemData;
    let prevPath: ExplorerItemData[] = [];
    let prevPage = 0;
    let prevPageSize = 0;
    let prevSort: string;
    let prevSortOrder: SortOrder;
    let prevFilter: Record<string, string>;

    this.reactionDisposers.push(
      // emit события onSelect
      reaction(
        () => this.store.selectedItem,
        selectedItem => {
          if (onSelect) {
            onSelect(selectedItem, this.store.path);
          }
        }
      ),

      // сброс options
      reaction(
        () => this.store.openedItem,
        openedItem => {
          this.store.setFilter({});
          this.store.setSort(getChildrenSortDefaultValue(openedItem));
          this.store.setSortOrder(getChildrenSortDefaultOrder(openedItem));
          this.store.setSortItems(getChildrenSortItems(openedItem));
        }
      ),

      reaction(
        () => [
          cloneDeep(this.store.path),
          this.store.page,
          this.store.pageSize,
          this.store.sort,
          this.store.sortOrder,
          cloneDeep(this.store.filter)
        ],
        async ([path, page, pageSize, sortOrder, sort, filter]: [
          ExplorerItemData[],
          number,
          number,
          SortOrder,
          string,
          Record<string, string>
        ]) => {
          if (!isEqual(path, prevPath)) {
            // отписка
            for (const channel of this.channels) {
              channel.off(this.service.refreshItems, this);
            }
            this.channels = [];
            // подписка на обновление
            for (const item of path) {
              for (const channel of getRefreshEmitters(item)) {
                if (!this.channels.includes(channel)) {
                  this.channels.push(channel);
                  channel.on(this.service.refreshItems, this);
                }
              }
            }
          }

          // обновление списка
          if (
            !isEqual(path.slice(0, -1), prevPath.slice(0, -1)) ||
            prevPage !== page ||
            prevPageSize !== pageSize ||
            prevSortOrder !== sortOrder ||
            prevSort !== sort ||
            !isEqual(prevFilter, filter)
          ) {
            await this.service.refreshItems();
          }

          // сохранение path в url
          if (
            !isEqual(path, prevPath) ||
            prevPage !== page ||
            prevPageSize !== pageSize ||
            prevSortOrder !== sortOrder ||
            prevSort !== sort ||
            !isEqual(prevFilter, filter)
          ) {
            await this.setStateToUrl(this.service.itemsEqual(this.store.openedItem, prevOpenedItem));

            prevOpenedItem = this.store.openedItem;
            prevPath = path;
            prevPage = page;
            prevPageSize = pageSize;
            prevSort = sort;
            prevSortOrder = sortOrder;
            prevFilter = filter;
          }
        },
        { fireImmediately: true }
      )
    );

    if (urlChangeEnabled) {
      await this.restoreStateFromUrl();
    }

    await when(() => !this.store.loading);
    await sleep(100);
    this.urlChangeEnabled = true;
  }

  componentDidUpdate(prevProps: ExplorerProps) {
    if (!isEqual(prevProps.path, this.props.path) || !isEqual(prevProps.preset, this.props.preset)) {
      this.init({ ...this.props });
    }
  }

  componentWillUnmount() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    for (const disposer of this.reactionDisposers) {
      disposer();
    }
    Emitter.scopeOff(this);
  }

  render() {
    const { withInfoPanel, fixedHeight, withoutTitle, libraryViewSwitch, className, disabledTester } = this.props;

    return (
      <div
        className={cnExplorer({ withInfoPanel }, [className])}
        onKeyDown={this.keyDownHandler}
        tabIndex={0}
        style={{ '--ExplorerPageSize': fixedHeight ? this.store.pageSize : 0 } as CSSProperties}
      >
        {!withoutTitle && <ExplorerBreadcrumb store={this.store} onOpen={this.openItem} />}
        <ExplorerList store={this.store} onOpen={this.openItem} disabledTester={disabledTester} />
        <ExplorerToolbar
          service={this.service}
          store={this.store}
          onChange={this.service.refreshItems}
          full={withInfoPanel}
          libraryViewSwitch={libraryViewSwitch}
        />
        {withInfoPanel && <ExplorerInfo store={this.store} />}
        <ExplorerPagination store={this.store} onChange={this.service.paginate} />
        <Loading visible={this.store.loading || this.store.restoringFromUrl} noBackdrop />
      </div>
    );
  }

  private init(props: ExplorerProps) {
    const { path, preset } = props;

    if (preset) {
      this.store.setPath(presets[preset]);
    } else {
      this.store.setPath(path.length ? path : [emptyItem]);
    }
  }

  @boundMethod
  openItem(item: ExplorerItemData, depth: number = this.store.path.length - 1): void {
    if (!isFolder(item, this.store)) {
      return;
    }

    this.store.setPath([...this.store.path.slice(0, depth), item, loadingItem]);
    this.store.setPage(0);

    if (this.props.onOpen) {
      this.props.onOpen(item, this.store.path);
    }
  }

  @boundMethod
  private keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    if (document.querySelector('input:focus,textarea:focus')) {
      return;
    }

    const { path, selectedItem, items, page, totalPages } = this.store;
    const action = Object.keys(keyActions).find(key => keyActions[key].includes(e.key));

    if (action === KeyAction.BACK && path.length >= 3) {
      void this.openItem(path[path.length - 3], path.length - 3);
    }

    if (action === KeyAction.PAGE_PREV && page > 0) {
      this.service.paginate(page - 1);
    }

    if (action === KeyAction.PAGE_NEXT && page < totalPages - 1) {
      this.service.paginate(page + 1);
    }

    if (action === KeyAction.PREV || action === KeyAction.NEXT) {
      const currentSelectionId = getId(selectedItem);
      const currentSelectionIndex = items.findIndex(item => getId(item) === currentSelectionId);
      const newSelectionIndex = action === KeyAction.NEXT ? currentSelectionIndex + 1 : currentSelectionIndex - 1;
      if (newSelectionIndex >= 0 && newSelectionIndex < items.length) {
        this.store.selectItem(items[newSelectionIndex]);
      }
    }

    if (action === KeyAction.OPEN) {
      void this.openItem(selectedItem);
    }
  }

  private async setStateToUrl(replaceUrl?: boolean) {
    if (!this.urlChangeEnabled || this.store.restoringFromUrl || !this.props.urlChangeEnabled) {
      return;
    }

    if (this.store.path[this.store.path.length - 1] === this.store.path[this.store.path.length - 2]) {
      return;
    }

    this.savingToUrl = true;

    await services.provided;
    const { path, page, pageSize, sort, sortOrder, filter } = this.store;

    const explorerItems = path.flatMap(item => [item.type, getId(item)]);
    const encodedURIPath = JSON.stringify(explorerItems);

    const explorerOptions: ExplorerUrlOptions = [page, pageSize, sort, sortOrder, filter];
    const encodedURIOptions = JSON.stringify(explorerOptions);

    const { explorerRole } = this.props;

    await services.router.navigate([location.pathname], {
      queryParams: {
        ['path_' + explorerRole]: encodedURIPath,
        ['opts_' + explorerRole]: encodedURIOptions
      },
      queryParamsHandling: 'merge',
      replaceUrl
    });
    await sleep(0);
    this.savingToUrl = false;
  }

  private async restoreStateFromUrl(url: URL = new URL(window.location.href)) {
    this.store.setRestoringFromUrl(true);

    const { explorerRole, onOpen } = this.props;

    if (url.searchParams.get(`path_${explorerRole}`)) {
      const urlExplorerPath = url.searchParams.get(`path_${explorerRole}`);
      const pathUrlItems = chunk(JSON.parse(urlExplorerPath) as string[], 2) as ExplorerUrlItem[];
      const path = this.store.path.slice(0, 1);

      for (let i = 1; i < pathUrlItems.length; i++) {
        const [type, id] = pathUrlItems[i];
        const child = type === ExplorerItemType.NONE ? emptyItem : await getChildById(path[i - 1], id, type);
        if (child) {
          path[i] = child;
        } else {
          break;
        }
      }

      this.store.setPath(path);
      this.restoreOptions(url);
    } else {
      this.init(this.props);
    }

    await sleep(100);

    this.store.setRestoringFromUrl(false);

    if (onOpen) {
      onOpen(this.store.openedItem, this.store.path);
    }
  }

  private restoreOptions(url: URL) {
    const urlExplorerOptions = url.searchParams.get(`opts_${this.props.explorerRole}`);

    if (!urlExplorerOptions) {
      return;
    }

    const [page, pageSize, sort, sortOrder, filter] = JSON.parse(urlExplorerOptions) as ExplorerUrlOptions;

    this.store.setPage(page);
    this.store.setPageSize(pageSize);
    this.store.setSort(sort);
    this.store.setSortOrder(sortOrder);
    this.store.setFilter(filter);
  }
}
