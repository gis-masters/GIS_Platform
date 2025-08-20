import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { AccountCircle, ContentCopy, Logout } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { authService } from '../../services/auth/auth/auth.service';
import { copyToClipboard } from '../../services/util/clipboard.util';
import { currentUser } from '../../stores/CurrentUser.store';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./User.scss';

const cnUser = cn('User');

interface UserProps extends IClassNameProps {
  logoutUrl?: string;
}

@observer
export class User extends Component<UserProps> {
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
          <span>
            <Button
              className={className || cnUser()}
              onClick={this.toggleMenu}
              endIcon={<AccountCircle />}
              color='inherit'
              variant='text'
              size='large'
            />
          </span>
        </Tooltip>

        <Menu open={Boolean(this.anchorEl)} onClose={this.toggleMenu} anchorEl={this.anchorEl}>
          <MenuItem>
            {
              <div className={cnUser('Info')}>
                <div className={cnUser('Fio')}>{`${currentUser.surname} ${currentUser.name}`}</div>
                <div className={cnUser('Email')}>
                  {currentUser.email}
                  <Tooltip title='Копировать email'>
                    <ContentCopy className={cnUser('Email-CopyIcon')} onClick={this.handleCopyClick} />
                  </Tooltip>
                </div>
              </div>
            }
          </MenuItem>

          <Divider />
          <MenuItem className={cnUser('Info', { type: 'action' })} onClick={this.logout}>
            <ListItemIcon>
              <Logout />
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
    void authService.logout(this.props.logoutUrl);
  }

  @boundMethod
  private handleCopyClick(e: React.MouseEvent) {
    e.stopPropagation();
    copyToClipboard(currentUser.email);
  }
}
