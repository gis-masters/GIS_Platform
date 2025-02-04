import React, { Component, ReactElement, SyntheticEvent } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { groupsService } from '../../services/auth/groups/groups.service';
import { CrgUser } from '../../services/auth/users/users.models';
import { usersService } from '../../services/auth/users/users.service';
import { communicationService } from '../../services/communication.service';
import {
  isPrincipalType,
  PrincipalType,
  Role,
  RoleAssignmentBody
} from '../../services/permissions/permissions.models';
import { addEntityPermission, removeEntityPermission } from '../../services/permissions/permissions.service';
import {
  definePermissionType,
  filterByPrincipal,
  filterOutPrincipal
} from '../../services/permissions/permissions.utils';
import { allGroups } from '../../stores/AllGroups.store';
import { allUsers } from '../../stores/AllUsers.store';
import { Button } from '../Button/Button';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { Loading } from '../Loading/Loading';
import { XTable } from '../XTable/XTable';
import { XTableColumn } from '../XTable/XTable.models';
import { PermissionsEditDialogAddPrincipal } from './AddPrincipal/PermissionsEditDialog-AddPrincipal';
import { PermissionsEditDialogRemovePrincipal } from './RemovePrincipal/PermissionsEditDialog-RemovePrincipal';
import { PermissionsEditDialogRoleSelect } from './RoleSelect/PermissionsEditDialog-RoleSelect';

import '!style-loader!css-loader!sass-loader!./Paper/PermissionsEditDialog-Paper.scss';
import '!style-loader!css-loader!sass-loader!./Table/PermissionsEditDialog-Table.scss';

const cnPermissionsEditDialog = cn('PermissionsEditDialog');

interface PermissionsEditDialogProps {
  url: string;
  title?: string;
  permissions: RoleAssignmentBody[];
  itemEntityType?: ExplorerItemEntityTypeTitle;
  open: boolean;
  onClose(): void;
  onChange(): void;
}

@observer
export class PermissionsEditDialog extends Component<PermissionsEditDialogProps> {
  @observable private busy = false;
  @observable private activeTab: PrincipalType = PrincipalType.USER;
  @observable private changedPermissions?: RoleAssignmentBody[];

  private usersCols: XTableColumn<CrgUser>[] = [
    { title: 'Фамилия', field: 'surname', filterable: true, sortable: true },
    { title: 'Имя', field: 'name', filterable: true, sortable: true },
    { title: 'e-mail', field: 'email', filterable: true, sortable: true, getIdBadge: ({ id }) => id },
    {
      title: 'Разрешения',
      cellProps: { padding: 'checkbox' },
      align: 'right',
      CellContent: observer(this.renderUserRoleSelect)
    },
    {
      title: 'Действия',
      cellProps: { padding: 'checkbox' },
      align: 'right',
      CellContent: this.renderUserActions
    }
  ];

  private groupsCols: XTableColumn<CrgGroup>[] = [
    {
      title: 'Название',
      field: 'name',
      filterable: true,
      sortable: true,
      getIdBadge: ({ id }) => id
    },
    {
      title: 'Описание',
      field: 'description',
      filterable: true,
      sortable: true,
      align: 'right'
    },
    {
      title: 'Пользователей',
      align: 'right',
      CellContent: ({ rowData }) => <>{rowData.users.length}</>
    },
    {
      title: 'Разрешения',
      cellProps: { padding: 'checkbox' },
      align: 'right',
      CellContent: observer(this.renderGroupRoleSelect)
    },
    {
      title: 'Действия',
      cellProps: { padding: 'checkbox' },
      align: 'right',
      CellContent: this.renderGroupActions
    }
  ];

  constructor(props: PermissionsEditDialogProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    void usersService.initUsersListStore();
    void groupsService.initAllGroupsStore();
  }

  render() {
    const { open, onClose, title } = this.props;

    return (
      <Dialog
        open={open}
        className={cnPermissionsEditDialog()}
        PaperProps={{ className: cnPermissionsEditDialog('Paper') }}
        onClose={onClose}
        maxWidth='xl'
      >
        <DialogTitle>Разрешения для "{title}"</DialogTitle>
        <DialogContent>
          <Tabs value={this.activeTab} onChange={this.handleTabsChange}>
            <Tab label='Пользователи' value={PrincipalType.USER} />
            <Tab label='Группы' value={PrincipalType.GROUP} />
          </Tabs>
          {this.activeTab === PrincipalType.USER && (
            <XTable
              className={cnPermissionsEditDialog('Table')}
              headerActions={
                <PermissionsEditDialogAddPrincipal
                  onAdd={this.handleAdd}
                  currentPrincipals={this.users}
                  principalType={PrincipalType.USER}
                  permissionType={definePermissionType(this.props.itemEntityType)}
                />
              }
              data={this.users}
              cols={this.usersCols}
              defaultSort={{ field: 'surname', asc: true }}
              secondarySortField='id'
              filterable
            />
          )}

          {this.activeTab === PrincipalType.GROUP && (
            <XTable
              headerActions={
                <PermissionsEditDialogAddPrincipal
                  onAdd={this.handleAdd}
                  currentPrincipals={this.groups}
                  principalType={PrincipalType.GROUP}
                  permissionType={definePermissionType(this.props.itemEntityType)}
                />
              }
              data={this.groups}
              cols={this.groupsCols}
              defaultSort={{ field: 'name', asc: true }}
              secondarySortField='id'
              filterable
            />
          )}

          <Loading noBackdrop visible={this.busy} />
        </DialogContent>
        <DialogActions>
          {this.changed ? (
            <Button onClick={this.close}>Закрыть</Button>
          ) : (
            <>
              <Button onClick={this.save} color='primary' disabled={this.busy}>
                Сохранить
              </Button>
              <Button onClick={this.close} disabled={this.busy}>
                Отмена
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get users(): CrgUser[] {
    return allUsers.list.filter(user =>
      this.currentPermissions.some(
        permission => user.id === permission.principalId && permission.principalType === PrincipalType.USER
      )
    );
  }

  @computed
  private get groups(): CrgGroup[] {
    return allGroups.list.filter(group =>
      this.currentPermissions.some(
        permission => group.id === permission.principalId && permission.principalType === PrincipalType.GROUP
      )
    );
  }

  @computed
  private get currentPermissions(): RoleAssignmentBody[] {
    return this.changedPermissions || this.props.permissions;
  }

  @computed
  private get changed(): boolean {
    return !this.changedPermissions;
  }

  @boundMethod
  private close() {
    this.props.onClose();
    setTimeout(this.reset, 300);
  }

  @action.bound
  private reset() {
    this.changedPermissions = undefined;
    this.activeTab = PrincipalType.USER;
  }

  @boundMethod
  private async save() {
    const { permissions, url, title, itemEntityType } = this.props;
    let existing = [...permissions];
    const changed = [...(this.changedPermissions || [])];
    const toCreate: RoleAssignmentBody[] = [];
    const toDelete: RoleAssignmentBody[] = [];
    this.setBusy(true);

    changed.forEach(changedItem => {
      const index = existing.findIndex(
        existingItem =>
          changedItem.role === existingItem.role &&
          changedItem.principalId === existingItem.principalId &&
          changedItem.principalType === existingItem.principalType
      );
      if (index === -1) {
        toCreate.push(changedItem);
        toDelete.splice(
          toDelete.length,
          0,
          ...filterByPrincipal(Number(changedItem.principalId), changedItem.principalType, existing)
        );
        existing = filterOutPrincipal(Number(changedItem.principalId), changedItem.principalType, existing);
      } else {
        existing.splice(index, 1);
      }
    });

    toDelete.splice(toDelete.length, 0, ...existing);

    for (const item of toCreate) {
      await addEntityPermission(item, url, title || '', itemEntityType);
    }

    for (const item of toDelete) {
      await removeEntityPermission(item, url, title || '', itemEntityType);
    }

    communicationService.permissionsUpdated.emit();
    this.setBusy(false);
    this.close();
  }

  @action.bound
  private handleAdd(permissions: RoleAssignmentBody[]) {
    this.changedPermissions = [...this.currentPermissions, ...permissions];
  }

  @action.bound
  private handleTabsChange(e: SyntheticEvent<Element, Event>, value: unknown) {
    if (!isPrincipalType(value)) {
      throw new Error('Ошибка: невозможное значение');
    }
    this.activeTab = value;
  }

  @boundMethod
  private renderUserRoleSelect({ rowData }: { rowData: CrgUser }): ReactElement {
    return this.renderRoleSelect(rowData, PrincipalType.USER);
  }

  @boundMethod
  private renderGroupRoleSelect({ rowData }: { rowData: CrgGroup }): ReactElement {
    return this.renderRoleSelect(rowData, PrincipalType.GROUP);
  }

  private renderRoleSelect(principal: CrgUser | CrgGroup, principalType: PrincipalType): ReactElement {
    return (
      <PermissionsEditDialogRoleSelect
        currentPermissions={this.currentPermissions}
        principalId={principal.id}
        principalType={principalType}
        onChange={this.handleChangeRole}
        permissionType={definePermissionType(this.props.itemEntityType)}
      />
    );
  }

  @boundMethod
  private renderUserActions({ rowData }: { rowData: CrgUser }): ReactElement {
    return this.renderActions(rowData, PrincipalType.USER);
  }

  @boundMethod
  private renderGroupActions({ rowData }: { rowData: CrgGroup }): ReactElement {
    return this.renderActions(rowData, PrincipalType.GROUP);
  }

  private renderActions(principal: CrgUser | CrgGroup, principalType: PrincipalType): ReactElement {
    return (
      <PermissionsEditDialogRemovePrincipal
        onRemove={this.removePrincipal}
        principalId={principal.id}
        principalType={principalType}
      />
    );
  }

  @action.bound
  private handleChangeRole(principalId: number, principalType: PrincipalType, role: Role) {
    this.changedPermissions = [
      ...filterOutPrincipal(principalId, principalType, this.currentPermissions),
      {
        principalId,
        principalType,
        role
      }
    ];
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private removePrincipal(principalId: number, principalType: PrincipalType) {
    this.changedPermissions = filterOutPrincipal(principalId, principalType, this.currentPermissions);
  }
}
