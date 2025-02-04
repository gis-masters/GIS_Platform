import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { IClassNameProps, withBemMod } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';
import { IconButton } from '../../IconButton/IconButton';
import { ActionsProps, cnActions } from '../Actions.base';
import { ActionsMenuOpenContext } from '../Item/_as/Actions-Item_as_menu';

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
      <ActionsMenuOpenContext.Provider value={open}>
        <IconButton size='small' className={cnActions({ open }, [className])} onClick={this.toggleOpen} color='primary'>
          <MenuIcon fontSize='small' />
        </IconButton>

        <Menu open={open} onClose={this.close} anchorEl={this.anchorEl} onClick={this.close} keepMounted>
          {children}
        </Menu>
      </ActionsMenuOpenContext.Provider>
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

export const asMenu = withBemMod<ActionsProps, ActionsProps>(cnActions(), { as: 'menu' }, Actions => props => (
  <Actions {...props} ContainerComponent={Container} />
));
