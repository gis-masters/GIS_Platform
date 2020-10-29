import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { List } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { getIcon, getId, getMeta, getTitle, isFolder } from '../Adapter/Explorer-Adapter';
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
    return (
      <List className={cnExplorerList()}>
        {this.currentList.map(this.getItemProps).map(props => (
          <ExplorerItem {...props} key={getId(props.item)} />
        ))}
      </List>
    );
  }

  @computed
  private get currentList(): ExplorerItemData[] {
    const { store } = this.props;

    return store.path.length >= 2 && store.path[store.path.length - 2].children
      ? store.path[store.path.length - 2].children
      : [];
  }

  @boundMethod
  private getItemProps(item: ExplorerItemData, i: number, items: ExplorerItemData[]): ExplorerItemProps {
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
    const { path } = store;
    const currtentPathItem = path[path.length - 1];

    return currtentPathItem && getId(currtentPathItem) === getId(item);
  }
}
