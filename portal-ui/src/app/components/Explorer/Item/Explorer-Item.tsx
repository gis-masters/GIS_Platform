import React, { Component, ReactNode, RefObject } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Item.scss';
import '!style-loader!css-loader!sass-loader!../ItemTitle/Explorer-ItemTitle.scss';

const cnExplorerItem = cn('Explorer', 'Item');
const cnExplorerItemTitle = cn('Explorer', 'ItemTitle');
const cnExplorerItemWrapper = cn('Explorer', 'ItemWrapper');

export interface ExplorerItemProps {
  item: ExplorerItemData;
  title: ReactNode;
  meta?: string;
  additionalInfo?: ReactNode;
  icon: ReactNode;
  selected: boolean;
  isFolder: boolean;
  customOpenActionIcon?: ReactNode;
  store: ExplorerStore;
  itemRef?: RefObject<HTMLDivElement>;
  onOpen(item: ExplorerItemData): void;
  disabledTester?(item: ExplorerItemData): Promise<boolean> | boolean;
  customOpenAction?(item: ExplorerItemData, store: ExplorerStore): void;
}

@observer
export class ExplorerItem extends Component<ExplorerItemProps> {
  @observable private disabled = false;

  constructor(props: ExplorerItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { disabledTester, item } = this.props;
    if (disabledTester) {
      this.setDisabled(await disabledTester(item));
    }
  }

  render() {
    const { title, meta, selected, customOpenActionIcon, icon, isFolder, additionalInfo, itemRef } = this.props;

    return (
      <ListItemButton
        className={cnExplorerItem({ selected })}
        selected={selected}
        onClick={this.handleSelect}
        onDoubleClickCapture={this.handleOpen}
        disabled={this.disabled}
        ref={itemRef}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {additionalInfo ? (
          <div className={cnExplorerItemWrapper()}>
            <ListItemText classes={{ primary: cnExplorerItemTitle() }} primary={title} secondary={meta} />
            {additionalInfo}
          </div>
        ) : (
          <ListItemText classes={{ primary: cnExplorerItemTitle() }} primary={title} secondary={meta} />
        )}
        {isFolder && (
          <ListItemSecondaryAction>
            <IconButton edge='end' onClick={this.handleButtonClick} disabled={this.disabled}>
              {customOpenActionIcon || <ChevronRight />}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
    );
  }

  @boundMethod
  private handleOpen() {
    const { customOpenActionIcon, customOpenAction, onOpen, item, store } = this.props;

    if (customOpenActionIcon && customOpenAction) {
      customOpenAction(item, store);
    } else {
      onOpen(item);
    }
  }

  @boundMethod
  private handleButtonClick() {
    this.handleOpen();
  }

  @boundMethod
  private handleSelect() {
    const { store, item } = this.props;
    store.selectItem(item);
  }

  @action
  private setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }
}
