import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { List } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { getEmptyListView, getIcon, getId, getMeta, getTitle, isFolder } from '../Adapter/Explorer-Adapter';
import { ExplorerEmpty } from '../Empty/Explorer-Empty';
import { ExplorerItem, ExplorerItemProps } from '../Item/Explorer-Item';
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
  componentDidMount() {
    const { store, onOpen } = this.props;

    if (store.path.length === 1) {
      onOpen(store.path[0], 0);
    }
  }

  render() {
    const { path } = this.props.store;
    const emptyListView = path.length > 1 ? getEmptyListView(path[path.length - 2]) : null;

    return (
      <List className={cnExplorerList(null, ['scroll'])} disablePadding>
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
}
