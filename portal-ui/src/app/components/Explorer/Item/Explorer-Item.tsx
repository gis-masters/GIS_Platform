import React, { Component, ReactNode, RefObject } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ChevronRight } from '@mui/icons-material';
import { IconButton, ListItemIcon, ListItemButton, ListItemSecondaryAction, ListItemText } from '@mui/material';

import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Item.scss';

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
  customOpenAction?: (item: ExplorerItemData) => void;
  store: ExplorerStore;
  itemRef?: RefObject<HTMLDivElement>;
  onOpen: (item: ExplorerItemData) => void;
  disabledTester?(item: ExplorerItemData): Promise<boolean> | boolean;
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
        onClick={this.selectHandler}
        onDoubleClickCapture={this.openHandler}
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
            <IconButton edge='end' onClick={this.buttonClickHandler} disabled={this.disabled}>
              {customOpenActionIcon || <ChevronRight />}
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
    );
  }

  @boundMethod
  private openHandler() {
    const { customOpenActionIcon, customOpenAction, onOpen, item } = this.props;

    if (customOpenActionIcon && customOpenAction) {
      customOpenAction(item);
    } else {
      onOpen(item);
    }
  }

  @boundMethod
  private buttonClickHandler() {
    this.openHandler();
  }

  @boundMethod
  private selectHandler() {
    const { store, item } = this.props;
    store.selectItem(item);
  }

  @action
  private setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }
}
