import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { AccountCircle, ExitToApp } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { authService } from '../../services/auth.service';
import { Button } from '../Button/Button';
import { currentUser } from '../../stores/CurrentUser.store';

const cnUser = cn('User');

@observer
export class User extends Component {
  @observable private anchorEl: HTMLElement | null = null;

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
          {currentUser.userName}
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
  logout() {
    authService.logout();
  }
}
