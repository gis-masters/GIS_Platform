import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { authService } from '../../services/auth/auth/auth.service';
import { Button } from '../Button/Button';
import { currentUser } from '../../stores/CurrentUser.store';

import '!style-loader!css-loader!sass-loader!./User.scss';

const cnUser = cn('User');

@observer
export class User extends Component<IClassNameProps> {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <>
        <Tooltip title={currentUser.login}>
          <Button
            className={className || cnUser()}
            onClick={this.toggleMenu}
            endIcon={<AccountCircle />}
            color='inherit'
            variant='text'
            size='large'
          />
        </Tooltip>

        <Menu open={Boolean(this.anchorEl)} onClose={this.toggleMenu} anchorEl={this.anchorEl}>
          <MenuItem>
            {
              <div className={cnUser('Info')}>
                <div>{`${currentUser.surname} ${currentUser.name}`}</div>
                <div>{currentUser.email}</div>
              </div>
            }
          </MenuItem>
          <MenuItem className={cnUser('Info', { type: 'action' })} onClick={this.logout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            Выход
          </MenuItem>
        </Menu>
      </>
    );
  }

  @action.bound
  private toggleMenu(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = this.anchorEl ? null : (e.target as HTMLElement);
  }

  @boundMethod
  private logout() {
    void authService.logout();
  }
}
