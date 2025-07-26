import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skeleton } from '@mui/material';
import { ChevronRightOutlined, Group, KeyboardArrowDown, Person } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { groupsService } from '../../services/auth/groups/groups.service';
import { CrgUser } from '../../services/auth/users/users.models';
import { usersService } from '../../services/auth/users/users.service';
import { communicationService } from '../../services/communication.service';
import { PrincipalType, Role, RoleAssignmentBody, rolesTitles } from '../../services/permissions/permissions.models';
import { getAllPermissions, getProjectPermissions } from '../../services/permissions/permissions.service';
import { getRolesByExplorerItemEntityType } from '../../services/permissions/permissions.utils';
import { allGroups } from '../../stores/AllGroups.store';
import { allUsers } from '../../stores/AllUsers.store';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { IconButton } from '../IconButton/IconButton';
import { PermissionsEditDialog } from '../PermissionsEditDialog/PermissionsEditDialog';
import { PseudoLink } from '../PseudoLink/PseudoLink';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./PermissionsWidget.scss';

const cnPermissionsWidget = cn('PermissionsWidget');

interface PermissionsWidgetProps {
  url: string;
  title?: string;
  disabled?: boolean;
  itemEntityType?: ExplorerItemEntityTypeTitle;
}

const MAX_PRINCIPALS_TO_SHOW = 20;
const MIN_PRINCIPALS_TO_HIDE = 5;

@observer
export class PermissionsWidget extends Component<PermissionsWidgetProps> {
  @observable private _fetching = false;
  @observable private dialogOpen = false;
  @observable private permissions: RoleAssignmentBody[] = [];
  @observable private expandedList: Partial<{ [key in Role]: true }> = {};
  @observable private isAccordionOpen: boolean = false;

  constructor(props: PermissionsWidgetProps) {
    super(props);

    makeObservable(this);
  }

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
    const { disabled, itemEntityType, url, title } = this.props;

    return (
      <>
        <div className={cnPermissionsWidget()}>
          <div className={cnPermissionsWidget('HeaderWrap')}>
            {!disabled && (
              <PseudoLink className={cnPermissionsWidget('Header')} disabled={disabled} onClick={this.openModal}>
                Разрешения
              </PseudoLink>
            )}
            {disabled && <span className={cnPermissionsWidget('Header', { disabled: true })}>Разрешения</span>}
            <IconButton className={cnPermissionsWidget('Open')} onClick={this.setAccordionIsOpen}>
              {this.isAccordionOpen ? <KeyboardArrowDown /> : <ChevronRightOutlined />}
            </IconButton>
          </div>
          <div className={cnPermissionsWidget('Content', { open: this.isAccordionOpen })}>
            {this.fetching ? (
              <>
                <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
                <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
                <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
              </>
            ) : (
              getRolesByExplorerItemEntityType(itemEntityType)
                .map(role => {
                  const groups = this.getListForRole(role, allGroups.list, PrincipalType.GROUP);
                  const users = this.getListForRole(role, allUsers.list, PrincipalType.USER);
                  const expanded = this.expandedList[role];
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
                              onClick={this.handleExpandedList}
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
        </div>

        <PermissionsEditDialog
          onClose={this.closeModal}
          open={this.dialogOpen}
          onChange={this.fetchPermissions}
          url={url}
          title={title}
          permissions={this.permissions}
          itemEntityType={itemEntityType}
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
    this.expandedList = {};
  }

  @action.bound
  private setAccordionIsOpen(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
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
    const roles = getRolesByExplorerItemEntityType(this.props.itemEntityType);

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
    const { url, title, itemEntityType } = this.props;

    this.setPermissions([], true);

    try {
      const permissions =
        itemEntityType === ExplorerItemEntityTypeTitle.PROJECT ||
        itemEntityType === ExplorerItemEntityTypeTitle.PROJECT_FOLDER
          ? await getProjectPermissions(url)
          : await getAllPermissions(url);
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
  private handleExpandedList(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    const role = e.currentTarget.dataset.role as Role;
    this.expandedList[role] = true;
  }
}
