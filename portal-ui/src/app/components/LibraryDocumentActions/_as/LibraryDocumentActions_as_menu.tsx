import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Menu } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { IClassNameProps, withBemMod } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import { cnLibraryDocumentActions, LibraryDocumentActionsProps } from '../LibraryDocumentActions';
import { LibraryDocumentActionsMenuOpenContext } from '../Item/_as/LibraryDocumentActions-Item_as_menu';

@observer
class Container extends Component<IClassNameProps & ChildrenProps> {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: IClassNameProps & ChildrenProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { children, className } = this.props;
    const open = Boolean(this.anchorEl);

    return (
      <LibraryDocumentActionsMenuOpenContext.Provider value={open}>
        <IconButton
          className={cnLibraryDocumentActions({ open }, [className])}
          onClick={this.toggleOpen}
          color='primary'
        >
          <MoreHoriz />
        </IconButton>

        <Menu open={open} onClose={this.close} anchorEl={this.anchorEl} onClick={this.close} keepMounted>
          {children}
        </Menu>
      </LibraryDocumentActionsMenuOpenContext.Provider>
    );
  }

  @action.bound
  private toggleOpen(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = this.anchorEl ? null : (e.target as HTMLElement);
  }

  @action.bound
  private close() {
    this.anchorEl = null;
  }
}

export const asMenu = withBemMod<LibraryDocumentActionsProps, LibraryDocumentActionsProps>(
  cnLibraryDocumentActions(),
  { as: 'menu' },
  LibraryDocumentActions => props => <LibraryDocumentActions {...props} ContainerComponent={Container} />
);
