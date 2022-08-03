import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { authService } from '../../services/auth.service';
import { Button } from '../Button/Button';
import { currentUser } from '../../stores/CurrentUser.store';

const cnUser = cn('User');

@observer
export class User extends Component {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Button
          className={cnUser()}
          onClick={this.toggleMenu}
          endIcon={<AccountCircle />}
          color='inherit'
          variant='text'
          size='large'
        >
          {currentUser.login}
        </Button>

        <Menu open={Boolean(this.anchorEl)} onClose={this.toggleMenu} anchorEl={this.anchorEl}>
          <MenuItem onClick={this.logout}>
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
