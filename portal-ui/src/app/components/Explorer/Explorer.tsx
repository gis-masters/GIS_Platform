import React, { Component, CSSProperties } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { Loading } from '../Loading/Loading';
import { Emitter } from '../../services/util/Emitter';

import { ExplorerStore } from './Explorer.store';
import { emptyItem, ExplorerItemData, ExplorerItemType, KeyAction, keyActions } from './Explorer.models';
import {
  getChildren,
  getChildrenSortDefaultDirection,
  getChildrenSortDefaultValue,
  getChildrenSortItems,
  getId,
  getRefreshEmitters,
  isFolder
} from './Adapter/Explorer-Adapter';
import { ExplorerPagination } from './Pagination/Explorer-Pagination';
import { ExplorerToolbar } from './Toolbar/Explorer-Toolbar';
import { ExplorerInfo } from './Info/Explorer-Info.composed';
import { ExplorerTitle } from './Title/Explorer-Title';
import { ExplorerList } from './List/Explorer-List';

import '!style-loader!css-loader!sass-loader!./Explorer.scss';

const cnExplorer = cn('Explorer');

const presets: Partial<{ [key in ExplorerItemType]: ExplorerItemData }> = {
  [ExplorerItemType.ROOT]: { type: ExplorerItemType.ROOT },
  [ExplorerItemType.DATASET_ROOT]: { type: ExplorerItemType.DATASET_ROOT },
  [ExplorerItemType.LIBRARY_ROOT]: { type: ExplorerItemType.LIBRARY_ROOT },
  [ExplorerItemType.PROJECTS_ROOT]: { type: ExplorerItemType.PROJECTS_ROOT },
  [ExplorerItemType.BASEMAPS_ROOT]: { type: ExplorerItemType.BASEMAPS_ROOT }
};

export interface ExplorerProps extends IClassNameProps {
  appRole: string;
  title?: string;
  items?: ExplorerItemData[];
  preset?: keyof typeof presets;
  disabledItems?: ExplorerItemData[];
  withInfoPanel?: boolean;
  withoutTitle?: boolean;
  fixedHeight?: boolean;
  onSelect?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
  onOpen?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
}

@observer
export class Explorer extends Component<ExplorerProps> {
  @observable private busy = false;

  private gettingChildrenToken: Symbol;
  private onSelectReactionDispose: IReactionDisposer;
  private store: ExplorerStore;
  private subscribedRefreshEmitterTypes: ExplorerItemType[] = [];

  constructor(props: ExplorerProps) {
    super(props);

    this.store = new ExplorerStore(props.appRole);
    this.init(props);
  }

  componentDidMount() {
    this.onSelectReactionDispose = reaction(
      () => this.store.selectedItem,
      selectedItem => {
        if (this.props.onSelect) {
          this.props.onSelect(selectedItem, this.store.path);
        }
      }
    );
  }

  componentWillUnmount() {
    this.onSelectReactionDispose();
    Emitter.scopeOff(this);
  }

  componentDidUpdate(prevProps: ExplorerProps) {
    if (!isEqual(prevProps, this.props)) {
      this.init(this.props);
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
        <ExplorerToolbar store={this.store} onChange={this.handleQueryChange} />
        {withInfoPanel && <ExplorerInfo store={this.store} type={this.store.selectedItem.type} Explorer={Explorer} />}
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

    this.store.disabledItems = disabledItems || [];
  }

  @boundMethod
  private async openItem(item: ExplorerItemData, page: number, depth?: number) {
    const { store, props } = this;

    if (props.onOpen) {
      props.onOpen(item, store.path);
    }

    if (!isFolder(item)) {
      return;
    }

    if (depth !== store.path.length - 2) {
      store.setSortItems(getChildrenSortItems(item));
      store.setSort(getChildrenSortDefaultValue(item));
      store.setSortDir(getChildrenSortDefaultDirection(item));
      store.setFilter({});
    }

    try {
      store.selectItem(item);
      this.setBusy(true);
      const { pageSize, sort, sortDir, filter } = store;

      const gettingChildrenToken = Symbol();
      this.gettingChildrenToken = gettingChildrenToken;

      const [children, pagesCount] = await getChildren(item, page, pageSize, sort, sortDir, filter);

      if (gettingChildrenToken === this.gettingChildrenToken) {
        children.forEach(child => {
          if (!this.subscribedRefreshEmitterTypes.includes(child.type)) {
            this.subscribedRefreshEmitterTypes.push(child.type);

            getRefreshEmitters(child).forEach(emitter => {
              emitter.on(this.refresh);
            });
          }
        });

        store.setPage(page);
        this.setChildren(item, children, pagesCount, depth);
      }
    } catch (e) {
      throw Error('Ошибка при получении элементов' + e);
    } finally {
      this.setBusy(false);
    }
  }

  @boundMethod
  private keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    if (document.querySelector('input:focus,textarea:focus')) {
      return;
    }

    const { path, selectedItem, openedItem: currentItem, page, totalPages } = this.store;
    const action = (Object.keys(keyActions) as (keyof typeof keyActions)[]).find(key =>
      keyActions[key].includes(e.key)
    );

    if (action === KeyAction.BACK && path.length >= 3) {
      this.openItem(path[path.length - 3], 0, path.length - 3);
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
      this.openItem(selectedItem, 0);
    }
  }

  @boundMethod
  private paginate(page: number) {
    const { path, openedItem: currentItem } = this.store;
    this.openItem(currentItem, page, path.length - 2);
  }

  @boundMethod
  private handleQueryChange() {
    const { path, openedItem: currentItem } = this.store;
    this.openItem(currentItem, 0, path.length - 2);
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

    this.openItem(store.openedItem, 0, store.path.length - 2);
  }
}
