import React, { Component, createRef } from 'react';
import { computed, IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { List } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { sleep } from '../../../services/util/sleep';

import { getEmptyListView, getIcon, getId, getMeta, getTitle, isFolder } from '../Adapter/Explorer-Adapter';
import { ExplorerItem, ExplorerItemProps } from '../Item/Explorer-Item';
import { ExplorerEmpty } from '../Empty/Explorer-Empty';
import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-List.scss';

const cnExplorerList = cn('Explorer', 'List');

interface ExplorerListProps {
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, page: number) => void;
}

@observer
export class ExplorerList extends Component<ExplorerListProps> {
  private thisRef = createRef<HTMLUListElement>();
  private explorerItemRef = createRef<HTMLDivElement>();
  private selectedItemReactionDisposer: IReactionDisposer;

  componentDidMount() {
    const { store, onOpen } = this.props;

    if (store.path.length === 1) {
      onOpen(store.path[0], 0);
    }

    this.selectedItemReactionDisposer = reaction(
      () => getId(store.selectedItem),
      () => void this.scrollTo()
    );
  }

  componentWillUnmount() {
    this.selectedItemReactionDisposer();
  }
  render() {
    const { path } = this.props.store;
    const emptyListView = path.length > 1 ? getEmptyListView(path[path.length - 2]) : null;

    return (
      <List className={cnExplorerList(null, ['scroll'])} disablePadding ref={this.thisRef}>
        {Boolean(this.currentList?.length) &&
          this.currentList.map(this.getItemProps).map(props => <ExplorerItem {...props} key={getId(props.item)} />)}

        {!this.currentList?.length ? (
          <>{emptyListView ? <ExplorerEmpty>{emptyListView}</ExplorerEmpty> : null}</>
        ) : null}
      </List>
    );
  }

  @computed
  private get currentList(): ExplorerItemData[] {
    const { path, openedItem } = this.props.store;

    return path.length >= 2 && openedItem.children ? openedItem.children : [];
  }

  @boundMethod
  private getItemProps(item: ExplorerItemData): ExplorerItemProps {
    const { onOpen, store } = this.props;

    return {
      item,
      title: getTitle(item),
      meta: getMeta(item),
      icon: getIcon(item),
      selected: this.isSelected(item),
      isFolder: isFolder(item),
      itemRef: this.isSelected(item) ? this.explorerItemRef : undefined,
      onOpen,
      store
    };
  }

  private isSelected(item: ExplorerItemData) {
    if (!item) {
      return false;
    }

    const { store } = this.props;
    const { selectedItem } = store;

    return selectedItem && getId(selectedItem) === getId(item);
  }

  @boundMethod
  private async scrollTo() {
    await sleep(200);

    const containerElem = this.thisRef.current;
    const explorerElem = this.explorerItemRef.current;

    if (explorerElem && containerElem.scrollTop > explorerElem.offsetTop) {
      containerElem.scrollTo({ top: explorerElem.offsetTop, behavior: 'smooth' });
    } else if (
      explorerElem &&
      containerElem.scrollTop + containerElem.offsetHeight < explorerElem.offsetTop + explorerElem.offsetHeight
    ) {
      containerElem.scrollTo({
        top:
          containerElem.scrollTop +
          (explorerElem.offsetTop + explorerElem.offsetHeight - (containerElem.scrollTop + containerElem.offsetHeight)),
        behavior: 'smooth'
      });
    }
  }
}
