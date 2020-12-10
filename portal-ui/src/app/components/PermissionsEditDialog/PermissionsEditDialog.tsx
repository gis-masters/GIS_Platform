import React, { Component, ReactNode } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allUsers } from '../../stores/AllUsers.store';
import { allGroups } from '../../stores/AllGroups.store';
import { addTablePermission, removeTablePermission } from '../../services/crg/permissions.client';
import { PrincipalType, Role, RoleAssignmentBody } from '../../services/crg/permissions.models';
import { filterByPrincipal, filterOutPrincipal } from '../../services/crg/permissions.service';
import { CrgGroup, groupsService } from '../../services/crg/groups.service';
import { communicationService } from '../../services/communication.service';
import { CrgUser, usersService } from '../../services/crg/users.service';
import { DataSet, DataTable } from '../../services/data.service';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { XTable } from '../XTable/XTable';

import { PermissionsEditDialogRoleSelect } from './RoleSelect/PermissionsEditDialog-RoleSelect';
import { PermissionsEditDialogAddPrincipal } from './AddPrincipal/PermissionsEditDialog-AddPrincipal';
import { PermissionsEditDialogRemovePrincipal } from './RemovePrincipal/PermissionsEditDialog-RemovePrincipal';

import '!style-loader!css-loader!sass-loader!./Paper/PermissionsEditDialog-Paper.scss';
import '!style-loader!css-loader!sass-loader!./Table/PermissionsEditDialog-Table.scss';

const cnPermissionsEditDialog = cn('PermissionsEditDialog');

interface PermissionsEditDialogProps {
  dataSet: DataSet;
  dataTable: DataTable;
  permissions: RoleAssignmentBody[];
  open: boolean;
  onClose: () => void;
  onChange: () => void;
}

@observer
export class PermissionsEditDialog extends Component<PermissionsEditDialogProps> {
  @observable private busy = false;
  @observable private activeTab: PrincipalType = PrincipalType.USER;
  @observable private changedPermissions?: RoleAssignmentBody[];

  componentDidMount() {
    usersService.initUsersListStore();
    groupsService.initGroupsListStore();
  }

  render() {
    const { open, onClose, dataTable } = this.props;

    return (
      <Dialog
        open={open}
        className={cnPermissionsEditDialog()}
        PaperProps={{ className: cnPermissionsEditDialog('Paper') }}
        onClose={onClose}
        maxWidth='xl'
      >
        <DialogTitle>Разрешения для таблицы "{dataTable.title}"</DialogTitle>
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
                />
              }
              data={this.users}
              cols={[
                { title: 'Фамилия', field: 'surname', filtering: true, sorting: true },
                { title: 'Имя', field: 'name', filtering: true, sorting: true },
                { title: 'e-mail', field: 'email', filtering: true, sorting: true, getIdBadge: ({ id }) => id },
                {
                  title: 'Разрешения',
                  cellProps: { padding: 'checkbox' },
                  align: 'right',
                  renderCellContent: this.renderUserRoleSelect
                },
                {
                  title: 'Действия',
                  cellProps: { padding: 'checkbox' },
                  align: 'right',
                  renderCellContent: this.renderUserActions
                }
              ]}
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
                />
              }
              data={this.groups}
              cols={[
                {
                  title: 'Название',
                  field: 'name',
                  filtering: true,
                  sorting: true,
                  getIdBadge: ({ id }) => id
                },
                {
                  title: 'Описание',
                  field: 'description',
                  filtering: true,
                  sorting: true,
                  align: 'right'
                },
                {
                  title: 'Пользователей',
                  align: 'right',
                  renderCellContent: ({ users }) => users.length
                },
                {
                  title: 'Разрешения',
                  cellProps: { padding: 'checkbox' },
                  align: 'right',
                  renderCellContent: this.renderGroupRoleSelect
                },
                {
                  title: 'Действия',
                  cellProps: { padding: 'checkbox' },
                  align: 'right',
                  renderCellContent: this.renderGroupActions
                }
              ]}
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
    const { dataSet, dataTable } = this.props;
    let existing = this.props.permissions.slice();
    const changed = this.changedPermissions.slice();
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

    for (const item of toDelete) {
      await removeTablePermission(item, dataSet.identifier, dataTable.identifier);
    }

    for (const item of toCreate) {
      await addTablePermission(item, dataSet.identifier, dataTable.identifier);
    }

    communicationService.permissionsUpdated.emit();
    this.setBusy(false);
    this.close();
  }

  @action.bound
  private handleAdd(permissions: RoleAssignmentBody[]) {
    this.changedPermissions = this.currentPermissions.concat(permissions);
  }

  @action.bound
  private handleTabsChange(e: React.ChangeEvent, value: PrincipalType) {
    this.activeTab = value;
  }

  @boundMethod
  private renderUserRoleSelect(user: CrgUser): ReactNode {
    return this.renderRoleSelect(user, PrincipalType.USER);
  }

  @boundMethod
  private renderGroupRoleSelect(group: CrgGroup): ReactNode {
    return this.renderRoleSelect(group, PrincipalType.GROUP);
  }

  private renderRoleSelect(principal: CrgUser | CrgGroup, principalType: PrincipalType): ReactNode {
    return (
      <PermissionsEditDialogRoleSelect
        currentPermissions={this.currentPermissions}
        principalId={principal.id}
        principalType={principalType}
        onChange={this.changeRoleHandler}
      />
    );
  }

  @boundMethod
  private renderUserActions(user: CrgUser): ReactNode {
    return this.renderActions(user, PrincipalType.USER);
  }

  @boundMethod
  private renderGroupActions(group: CrgGroup): ReactNode {
    return this.renderActions(group, PrincipalType.GROUP);
  }

  private renderActions(principal: CrgUser | CrgGroup, principalType: PrincipalType): ReactNode {
    return (
      <PermissionsEditDialogRemovePrincipal
        onRemove={this.removePrincipal}
        principalId={principal.id}
        principalType={principalType}
      />
    );
  }

  @action.bound
  private changeRoleHandler(principalId: number, principalType: PrincipalType, role: Role) {
    this.changedPermissions = filterOutPrincipal(principalId, principalType, this.currentPermissions).concat({
      principalId,
      principalType,
      role
    });
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
