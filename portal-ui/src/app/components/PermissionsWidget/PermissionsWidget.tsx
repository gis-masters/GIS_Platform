import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skeleton } from '@mui/material';
import { Edit, EditOutlined, Group, Person } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allUsers } from '../../stores/AllUsers.store';
import { allGroups } from '../../stores/AllGroups.store';
import { PrincipalType, Role, RoleAssignmentBody, roles, rolesTitles } from '../../services/crg/permissions.models';
import { communicationService } from '../../services/communication.service';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { getTablePermissions } from '../../services/crg/permissions.client';
import { CrgUser, usersService } from '../../services/crg/users.service';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';
import { PermissionsEditDialog } from '../PermissionsEditDialog/PermissionsEditDialog';
import { ExplorerItemEntityType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./PermissionsWidget.scss';

const cnPermissionsWidget = cn('PermissionsWidget');

interface PermissionsWidgetProps {
  url: string;
  title?: string;
  disabled?: boolean;
  itemEntityType?: ExplorerItemEntityType;
}

const MAX_PRINCIPALS_TO_SHOW = 20;
const MIN_PRINCIPALS_TO_HIDE = 5;

@observer
export class PermissionsWidget extends Component<PermissionsWidgetProps> {
  @observable private _fetching = false;
  @observable private dialogOpen = false;
  @observable private permissions: RoleAssignmentBody[] = [];
  @observable private moarExpanded: Partial<{ [key in Role]: true }> = {};

  componentDidMount() {
    void usersService.initUsersListStore();
    void groupsService.initAllGroupsStore();
    void this.fetchPermissions();
    communicationService.permissionsUpdated.on(this.fetchPermissions, this);
  }

  componentDidUpdate(prevProps: PermissionsWidgetProps) {
    const { url } = this.props;
    const { url: prevUrl } = prevProps;

    if (url !== prevUrl) {
      void this.fetchPermissions();
    }
  }

  componentWillUnmount() {
    communicationService.permissionsUpdated.scopeOff(this);
  }

  render() {
    const EditIcon = this.dialogOpen ? Edit : EditOutlined;

    return (
      <>
        <div className={cnPermissionsWidget()}>
          <Button
            className={cnPermissionsWidget('Header')}
            endIcon={<EditIcon fontSize='inherit' />}
            variant='text'
            disabled={this.props.disabled}
            onClick={this.openModal}
          >
            Разрешения
          </Button>

          {this.fetching ? (
            <>
              <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
              <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
              <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
            </>
          ) : (
            roles
              .map(role => {
                const groups = this.getListForRole(role, allGroups.list, PrincipalType.GROUP);
                const users = this.getListForRole(role, allUsers.list, PrincipalType.USER);
                const expanded = this.moarExpanded[role];
                const totalCount = groups.length + users.length;
                const hiddenCount =
                  !expanded && totalCount > MAX_PRINCIPALS_TO_SHOW
                    ? Math.max(totalCount - MAX_PRINCIPALS_TO_SHOW, MIN_PRINCIPALS_TO_HIDE)
                    : 0;
                const shownCount = totalCount - hiddenCount;

                return (
                  Boolean(totalCount) && (
                    <div className={cnPermissionsWidget('List')} key={role}>
                      <span className={cnPermissionsWidget('ListTitle')}>{rolesTitles[role]}: </span>
                      <div className={cnPermissionsWidget('ListItems')}>
                        {groups.slice(0, shownCount).map(group => (
                          <span className={cnPermissionsWidget('Item')} key={`g${group.id}`}>
                            <Group className={cnPermissionsWidget('ItemIcon')} />
                            {group.name}
                          </span>
                        ))}
                        {users.slice(0, Math.max(shownCount - groups.length, 0)).map(user => (
                          <span className={cnPermissionsWidget('Item')} key={`u${user.id}`}>
                            <Person className={cnPermissionsWidget('ItemIcon')} />
                            {user.name}
                          </span>
                        ))}
                      </div>

                      {!expanded && Boolean(hiddenCount) && (
                        <span className={cnPermissionsWidget('Moar')}>
                          ...
                          <PseudoLink
                            className={cnPermissionsWidget('MoarLink')}
                            onClick={this.handleMoar}
                            data-role={role}
                          >
                            (ещё {hiddenCount})
                          </PseudoLink>
                        </span>
                      )}
                    </div>
                  )
                );
              })
              .reverse()
          )}
        </div>

        <PermissionsEditDialog
          onClose={this.closeModal}
          open={this.dialogOpen}
          onChange={this.fetchPermissions}
          url={this.props.url}
          title={this.props.title}
          permissions={this.permissions}
          itemEntityType={this.props.itemEntityType}
        />
      </>
    );
  }

  @computed
  private get fetching(): boolean {
    return this._fetching || allGroups.fetching || allUsers.fetching;
  }

  @action
  private setPermissions(permissions: RoleAssignmentBody[], fetching: boolean) {
    this.permissions = permissions;
    this._fetching = fetching;
    this.moarExpanded = {};
  }

  @action.bound
  private openModal() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeModal() {
    this.dialogOpen = false;
  }

  private getListForRole<T extends CrgUser | CrgGroup>(listRole: Role, arr: T[], type: PrincipalType): T[] {
    const greaterRoles = new Set(roles.slice(roles.indexOf(listRole) + 1, roles.length));

    return arr
      .filter(
        ({ id }) =>
          this.permissions.some(
            ({ principalId, principalType, role }) => principalId === id && principalType === type && role === listRole
          ) &&
          !this.permissions.some(
            ({ principalId, principalType, role }) =>
              principalId === id && principalType === type && greaterRoles.has(role)
          )
      )
      .sort((a, b) => ((a as CrgUser).surname + a.name > (b as CrgUser).surname + b.name ? 1 : -1));
  }

  @boundMethod
  private async fetchPermissions() {
    const { url, title } = this.props;
    this.setPermissions([], true);

    try {
      const permissions = await getTablePermissions(url);
      // тут так надо
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (url === this.props.url) {
        this.setPermissions(permissions, false);
      }
    } catch {
      Toast.error(`Ошибка получения прав для ${title}`);
    }
  }

  @action.bound
  private handleMoar(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const role = e.currentTarget.getAttribute('data-role') as Role;
    this.moarExpanded[role] = true;
  }
}
