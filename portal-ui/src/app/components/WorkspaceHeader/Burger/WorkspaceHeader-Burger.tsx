import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { Menu as MenuIcon, Map, ViewModule, Business, CloudDownload, Storage } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { route } from '../../../stores/Route.store';
import { Pages } from '../../../app-routing.module';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Burger.scss';

const cnWorkspaceHeaderBurger = cn('WorkspaceHeader', 'Burger');

@observer
export class WorkspaceHeaderBurger extends Component {
  @observable private anchorEl: HTMLElement | null = null;

  render() {
    return (
      <>
        <IconButton className={cnWorkspaceHeaderBurger()} onClick={this.toggleOpen} color='inherit'>
          <MenuIcon fontSize='inherit' />
        </IconButton>

        <Menu open={Boolean(this.anchorEl)} onClose={this.close} anchorEl={this.anchorEl}>
          {route.data.page === Pages.MAP && currentUser.isAdmin && (
            <Link href={`/projects/${currentProject.id}/import`} variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <CloudDownload />
                </ListItemIcon>
                Импорт данных
              </MenuItem>
            </Link>
          )}

          {route.data.page === Pages.IMPORT && (
            <Link href={`/projects/${currentProject.id}/map`} variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <Map />
                </ListItemIcon>
                Карта
              </MenuItem>
            </Link>
          )}

          <Link href='/projects' variant='contents' delay={300}>
            <MenuItem onClick={this.close}>
              <ListItemIcon>
                <ViewModule />
              </ListItemIcon>
              Проекты
            </MenuItem>
          </Link>

          {organizationSettings.dataManagementEnabled && (
            <Link href='/data-management' variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <Storage />
                </ListItemIcon>
                Управление данными
              </MenuItem>
            </Link>
          )}

          {currentUser.isAdmin && (
            <Link href='/org-admin' variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                Управление организацией
              </MenuItem>
            </Link>
          )}
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
