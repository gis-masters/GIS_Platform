import React, { Component, ReactNode, RefObject } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { ChevronRight } from '@mui/icons-material';
import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@mui/material';

import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

const cnExplorerItem = cn('Explorer', 'Item');

export interface ExplorerItemProps {
  item: ExplorerItemData;
  title: ReactNode;
  meta?: string;
  icon: ReactNode;
  selected: boolean;
  isFolder: boolean;
  store: ExplorerStore;
  itemRef?: RefObject<HTMLDivElement>;
  onOpen: (item: ExplorerItemData, page: number) => void;
  disabledTester?(item: ExplorerItemData): boolean;
}

@observer
export class ExplorerItem extends Component<ExplorerItemProps> {
  render() {
    const { title, meta, selected, isFolder, icon, itemRef } = this.props;

    return (
      <ListItem
        className={cnExplorerItem({ selected })}
        selected={selected}
        button
        onClick={this.selectHandler}
        onDoubleClick={this.openHandler}
        disabled={this.disabled}
        ref={itemRef}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} secondary={meta} />
        {isFolder && (
          <ListItemSecondaryAction>
            <IconButton edge='end' aria-label='delete' onClick={this.openHandler} disabled={this.disabled}>
              <ChevronRight />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
  }

  @computed
  private get disabled(): boolean {
    const { item, disabledTester } = this.props;

    return disabledTester ? disabledTester(item) : false;
  }

  @boundMethod
  private openHandler() {
    this.props.onOpen(this.props.item, 0);
  }

  @boundMethod
  private selectHandler() {
    this.props.store.selectItem(this.props.item);
  }
}
