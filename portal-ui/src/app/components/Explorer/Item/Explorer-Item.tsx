import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { ExplorerItemData } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

const cnExplorerItem = cn('Explorer', 'Item');

export interface ExplorerItemProps {
  item: ExplorerItemData;
  title: string;
  meta?: string;
  icon: ReactNode;
  selected: boolean;
  isFolder: boolean;
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, page: number) => void;
}

@observer
export class ExplorerItem extends Component<ExplorerItemProps> {
  render() {
    const { title, meta, selected, isFolder } = this.props;

    return (
      <ListItem
        className={cnExplorerItem({ selected })}
        selected={selected}
        button
        onClick={this.selectHandler}
        onDoubleClick={this.openHandler}
      >
        <ListItemIcon>{this.props.icon}</ListItemIcon>
        <ListItemText primary={title} secondary={meta} />
        {isFolder && (
          <ListItemSecondaryAction>
            <IconButton edge='end' aria-label='delete' onClick={this.openHandler}>
              <ChevronRight />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
    );
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
