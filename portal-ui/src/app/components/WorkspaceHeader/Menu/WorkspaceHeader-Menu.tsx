import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Business, CloudDownload, Map, Storage, ViewModule } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { Pages, route } from '../../../stores/Route.store';
import { Link } from '../../Link/Link';
import { WorkspaceHeaderBurger } from '../Burger/WorkspaceHeader-Burger';

const cnWorkspaceHeaderMenu = cn('WorkspaceHeader', 'Menu');
const cnWorkspaceHeaderMenuItemTitle = cn('WorkspaceHeader', 'MenuItemTitle');

@observer
export class WorkspaceHeaderMenu extends Component {
  @observable private anchorEl: HTMLElement | null = null;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <WorkspaceHeaderBurger toggleOpen={this.toggleOpen} />

        <Menu
          open={Boolean(this.anchorEl)}
          className={cnWorkspaceHeaderMenu()}
          onClose={this.close}
          anchorEl={this.anchorEl}
        >
          {route.data.page === Pages.MAP && currentUser.isAdmin && organizationSettings.importShp && (
            <Link href={`/projects/${currentProject.id}/import`} variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <CloudDownload />
                </ListItemIcon>
                <span className={cnWorkspaceHeaderMenuItemTitle()}>Импорт данных</span>
              </MenuItem>
            </Link>
          )}

          {route.data.page === Pages.IMPORT && (
            <Link href={`/projects/${currentProject.id}/map`} variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <Map />
                </ListItemIcon>
                <span className={cnWorkspaceHeaderMenuItemTitle()}>Карта</span>
              </MenuItem>
            </Link>
          )}

          <Link href='/projects' variant='contents' delay={300}>
            <MenuItem onClick={this.close}>
              <ListItemIcon>
                <ViewModule />
              </ListItemIcon>
              <span className={cnWorkspaceHeaderMenuItemTitle()}>Проекты</span>
            </MenuItem>
          </Link>

          <Link href='/data-management' variant='contents' delay={300}>
            <MenuItem onClick={this.close}>
              <ListItemIcon>
                <Storage />
              </ListItemIcon>
              <span className={cnWorkspaceHeaderMenuItemTitle()}>Управление данными</span>
            </MenuItem>
          </Link>

          {currentUser.isAdmin && (
            <Link href='/org-admin' variant='contents' delay={300}>
              <MenuItem onClick={this.close}>
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <span className={cnWorkspaceHeaderMenuItemTitle()}>Управление организацией</span>
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
