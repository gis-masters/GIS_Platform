import React, { Component, CSSProperties } from 'react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { isEqual } from 'lodash';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Loading } from '../Loading/Loading';

import { emptyItem, ExplorerItemData, ExplorerItemType } from './Explorer.models';
import {
  getChildren,
  getChildrenSortDefaultDirection,
  getChildrenSortDefaultValue,
  getChildrenSortItems,
  getId,
  isFolder
} from './Adapter/Explorer-Adapter';
import { ExplorerPagination } from './Pagination/Explorer-Pagination';
import { ExplorerToolbar } from './Toolbar/Explorer-Toolbar';
import { ExplorerInfo } from './Info/Explorer-Info.composed';
import { ExplorerTitle } from './Title/Explorer-Title';
import { ExplorerList } from './List/Explorer-List';
import { ExplorerStore } from './Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer.scss';

const cnExplorer = cn('Explorer');

enum KeyAction {
  NEXT = 'next',
  PREV = 'prev',
  OPEN = 'open',
  BACK = 'back',
  PAGE_PREV = 'pagePrev',
  PAGE_NEXT = 'pageNext'
}

const keyActions: { [key in KeyAction]: string[] } = {
  [KeyAction.PREV]: ['ArrowUp'],
  [KeyAction.NEXT]: ['ArrowDown'],
  [KeyAction.OPEN]: ['Enter'],
  [KeyAction.BACK]: ['Backspace'],
  [KeyAction.PAGE_PREV]: ['ArrowLeft'],
  [KeyAction.PAGE_NEXT]: ['ArrowRight']
};

const presets: Partial<{ [key in ExplorerItemType]: ExplorerItemData }> = {
  [ExplorerItemType.DATA_SET_ROOT]: { type: ExplorerItemType.DATA_SET_ROOT }
};

interface ExplorerProps {
  title?: string;
  items?: ExplorerItemData[];
  preset?: keyof typeof presets;
  disabledItems?: ExplorerItemData[];
  withInfoPanel?: boolean;
  fixedHeight?: boolean;
  onSelect?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
  onOpen?: (item: ExplorerItemData, path: ExplorerItemData[]) => void;
}

@observer
export class Explorer extends Component<ExplorerProps> {
  private onSelectReactionDispose: IReactionDisposer;
  @observable private busy = false;
  private store: ExplorerStore = new ExplorerStore();

  constructor(props: ExplorerProps) {
    super(props);
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
  }

  componentDidUpdate(prevProps: ExplorerProps) {
    if (!isEqual(prevProps, this.props)) {
      this.init(this.props);
    }
  }

  render() {
    const { withInfoPanel, fixedHeight } = this.props;

    return (
      <div
        className={cnExplorer({ withInfoPanel })}
        onKeyDown={this.keyDownHandler}
        tabIndex={0}
        style={{ '--ExplorerPageSize': fixedHeight ? this.store.pageSize : 0 } as CSSProperties}
      >
        <ExplorerTitle store={this.store} onOpen={this.openItem} />
        <ExplorerList store={this.store} onOpen={this.openItem} />
        <ExplorerToolbar store={this.store} onChange={this.handleQueryChange} />
        {withInfoPanel && <ExplorerInfo store={this.store} type={this.store.selectedItem.type} />}
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

    store.selectItem(item);
    this.setBusy(true);
    const { pageSize, sort, sortDir, filter } = store;
    const [children, pagesCount] = await getChildren(item, page, pageSize, sort, sortDir, filter);
    this.setBusy(false);
    store.setPage(page);
    this.setChildren(item, children, pagesCount, depth);
  }

  @boundMethod
  private keyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
    if (document.querySelector('input:focus,textarea:focus')) {
      return;
    }

    const { path, selectedItem, currentItem, page, totalPages } = this.store;
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
    const { path, currentItem } = this.store;
    this.openItem(currentItem, page, path.length - 2);
  }

  @boundMethod
  private handleQueryChange() {
    const { path, currentItem } = this.store;
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
}
