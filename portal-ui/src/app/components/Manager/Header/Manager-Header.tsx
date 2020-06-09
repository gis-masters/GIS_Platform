import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import Home from '@material-ui/icons/Home';
import { localStorageService } from '../../../services/local-storage.service';
import { services } from '../../../services/services';

const cnManagerHeader = cn('Manager', 'Header');

export class ManagerHeader extends Component {
  render() {
    const userInfo = localStorageService.getUserInfo();

    return (
      <AppBar position='static' className={cnManagerHeader()}>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu' onClick={this.goHome}>
            <Home />
          </IconButton>
          <Typography variant='h6'>
            {userInfo.userName}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  private goHome() {
    services.router.navigateByUrl('/projects');
  }
}
