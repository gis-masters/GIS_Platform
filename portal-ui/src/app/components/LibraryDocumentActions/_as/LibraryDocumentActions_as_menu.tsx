import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Menu } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { IClassNameProps, withBemMod } from '@bem-react/core';

import { cnLibraryDocumentActions, LibraryDocumentActionsProps } from '../LibraryDocumentActions';

@observer
class Container extends Component<IClassNameProps> {
  @observable private anchorEl: HTMLElement | null = null;

  render() {
    const { children, className } = this.props;

    return (
      <>
        <IconButton
          className={cnLibraryDocumentActions({ open: Boolean(this.anchorEl) }, [className])}
          onClick={this.toggleOpen}
          color='primary'
        >
          <MoreHoriz />
        </IconButton>

        <Menu
          open={Boolean(this.anchorEl)}
          onClose={this.close}
          anchorEl={this.anchorEl}
          onClick={this.close}
          keepMounted
        >
          {children}
        </Menu>
      </>
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
