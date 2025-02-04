import React, { Component, createRef } from 'react';
import { computed, IReactionDisposer, makeObservable, reaction, when } from 'mobx';
import { observer } from 'mobx-react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sleep } from '../../../services/util/sleep';
import {
  additionalInfo,
  customOpenAction,
  customOpenActionIcon,
  getIcon,
  getId,
  getMeta,
  getTitle,
  isFolder
} from '../Adapter/Explorer-Adapter';
import { ExplorerEmpty } from '../Empty/Explorer-Empty';
import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';
import { ExplorerItem, ExplorerItemProps } from '../Item/Explorer-Item';

import '!style-loader!css-loader!sass-loader!./Explorer-List.scss';

const cnExplorerList = cn('Explorer', 'List');

interface ExplorerListProps {
  store: ExplorerStore;
  onOpen(item: ExplorerItemData): void;
  disabledTester?(item: ExplorerItemData): Promise<boolean> | boolean;
}

@observer
export class ExplorerList extends Component<ExplorerListProps> {
  private thisRef = createRef<HTMLUListElement>();
  private selectedItemRef = createRef<HTMLDivElement>();
  private selectedItemReactionDisposer?: IReactionDisposer;

  constructor(props: ExplorerListProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { store, onOpen } = this.props;

    if (store.path.length === 1) {
      onOpen(store.path[0]);
    }

    await sleep(100);
    await when(() => !store.restoringFromUrl);

    this.selectedItemReactionDisposer = reaction(
      () => [getId(store.selectedItem, store), store.selectedItem.type],
      async () => await this.scrollToSelectedItem(),
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    this.selectedItemReactionDisposer?.();
  }

  render() {
    return (
      <List className={cnExplorerList(null, ['scroll'])} disablePadding ref={this.thisRef}>
        {Boolean(this.currentList?.length) &&
          this.currentList
            .map(this.getItemProps)
            .map((props, i) => <ExplorerItem {...props} key={String(i) + getId(props.item, this.props.store)} />)}
        {!this.currentList?.length && <ExplorerEmpty />}
      </List>
    );
  }

  @computed
  private get currentList(): ExplorerItemData[] {
    const { items } = this.props.store;

    return items || [];
  }

  @boundMethod
  private getItemProps(item: ExplorerItemData): ExplorerItemProps {
    const { onOpen, store, disabledTester } = this.props;
    const selectedItem = this.isSelected(item);

    return {
      item,
      title: getTitle(item, store),
      meta: getMeta(item, store),
      icon: getIcon(item, store),
      additionalInfo: additionalInfo(item, store),
      selected: selectedItem,
      isFolder: isFolder(item, store),
      itemRef: selectedItem ? this.selectedItemRef : undefined,
      customOpenActionIcon: customOpenActionIcon(item, store),
      customOpenAction,
      onOpen,
      store,
      disabledTester
    };
  }

  private isSelected(item: ExplorerItemData) {
    if (!item) {
      return false;
    }

    const { store } = this.props;
    const { selectedItem } = store;

    return selectedItem && getId(selectedItem, store) === getId(item, store);
  }

  @boundMethod
  private async scrollToSelectedItem() {
    await sleep(200);

    const container = this.thisRef.current;
    const selected = this.selectedItemRef.current;

    if (selected && container && container.scrollTop > selected.offsetTop) {
      container.scrollTo({ top: selected.offsetTop, behavior: 'smooth' });
    } else if (
      selected &&
      container &&
      container.scrollTop + container.offsetHeight < selected.offsetTop + selected.offsetHeight
    ) {
      container.scrollTo({
        top:
          container.scrollTop +
          (selected.offsetTop + selected.offsetHeight - (container.scrollTop + container.offsetHeight)),
        behavior: 'smooth'
      });
    }
  }
}
