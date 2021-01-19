import React, { Component, ReactNode } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Tooltip
} from '@material-ui/core';
import { GroupAdd, GroupAddOutlined, PersonAdd, PersonAddOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allUsers } from '../../../stores/AllUsers.store';
import { allGroups } from '../../../stores/AllGroups.store';
import { PrincipalType, Role, RoleAssignmentBody, roles, rolesTitles } from '../../../services/crg/permissions.models';
import { CrgGroup } from '../../../services/crg/groups.service';
import { CrgUser } from '../../../services/crg/users.service';
import { XTable, XTableColumn } from '../../XTable/XTable';
import { Button } from '../../Button/Button';

import { PermissionsEditDialogCheckPrincipal } from '../CheckPrincipal/PermissionsEditDialog-CheckPrincipal';

import '!style-loader!css-loader!sass-loader!../AddPrincipalTable/PermissionsEditDialog-AddPrincipalTable.scss';

const cnPermissionsEditDialog = cn('PermissionsEditDialog');

interface PermissionsEditDialogAddPrincipalProps {
  principalType: PrincipalType;
  onAdd: (permissions: RoleAssignmentBody[]) => void;
  currentPrincipals: (CrgUser | CrgGroup)[];
}

@observer
export class PermissionsEditDialogAddPrincipal extends Component<PermissionsEditDialogAddPrincipalProps> {
  @observable private dialogOpen = false;
  @observable private role: Role = Role.VIEWER;
  @observable private selectedPrincipals: (CrgUser | CrgGroup)[] = [];

  private cols: XTableColumn<CrgUser | CrgGroup>[] = [
    {
      title: (
        <Checkbox
          indeterminate={this.selectedPrincipals.length > 0 && !this.selectedAll}
          checked={this.selectedAll}
          onChange={this.handleSelectAll}
        />
      ),
      cellProps: { padding: 'checkbox' },
      renderCellContent: this.renderCheckbox
    },
    ...this.getColumns()
  ];

  render() {
    const { principalType } = this.props;
    const UserIcon = this.dialogOpen ? PersonAdd : PersonAddOutlined;
    const GroupIcon = this.dialogOpen ? GroupAdd : GroupAddOutlined;
    const CurrentIcon = principalType === PrincipalType.USER ? UserIcon : GroupIcon;

    return (
      <>
        <Tooltip title={`Добавить ${principalType === PrincipalType.USER ? 'пользователя' : 'группу'}`}>
          <IconButton className={cnPermissionsEditDialog('AddPrincipal')} onClick={this.open}>
            <CurrentIcon />
          </IconButton>
        </Tooltip>
        <Dialog open={this.dialogOpen} onClose={this.close} maxWidth='xl'>
          <DialogContent>
            <XTable
              className={cnPermissionsEditDialog('AddPrincipalTable')}
              title='Добавление разрешений'
              data={this.viewedPrincipals}
              cols={this.cols}
              defaultSort={{ field: 'createdAt', asc: true }}
              secondarySortField='id'
              filterable
            />
          </DialogContent>
          <DialogActions>
            <Select value={this.role} onChange={this.handleRoleChange}>
              {roles.map(roleName => (
                <MenuItem value={roleName} key={roleName}>
                  {rolesTitles[roleName]}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={this.handleAdd} color='primary' disabled={!this.selectedPrincipals.length}>
              Добавить
            </Button>
            <Button onClick={this.close}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get viewedPrincipals(): (CrgUser | CrgGroup)[] {
    return this.props.principalType === PrincipalType.USER ? allUsers.list : allGroups.list;
  }

  @computed
  private get availablePrincipals(): (CrgUser | CrgGroup)[] {
    return this.viewedPrincipals.filter(item => !this.props.currentPrincipals.some(exItem => exItem.id === item.id));
  }

  @computed
  private get selectedAll(): boolean {
    return this.availablePrincipals.length > 0 && this.selectedPrincipals.length === this.availablePrincipals.length;
  }

  @action.bound
  private open() {
    this.dialogOpen = true;
  }

  @action.bound
  private close() {
    this.dialogOpen = false;
    this.selectedPrincipals = [];
    this.role = Role.VIEWER;
  }

  @action.bound
  private handleRoleChange(e: React.ChangeEvent<{ name?: string; value: Role }>) {
    this.role = e.target.value;
  }

  @action.bound
  private handleSelectAll() {
    this.selectedPrincipals = this.selectedAll ? [] : [...this.availablePrincipals];
  }

  @boundMethod
  private handleAdd() {
    const { onAdd, principalType } = this.props;
    onAdd(this.selectedPrincipals.map(({ id }) => ({ principalId: id, principalType, role: this.role })));
    this.close();
  }

  @boundMethod
  private renderCheckbox(principal: CrgUser | CrgGroup): ReactNode {
    return (
      <PermissionsEditDialogCheckPrincipal
        principal={principal}
        selectedPrincipals={this.selectedPrincipals}
        avaiablePrincipals={this.availablePrincipals}
      />
    );
  }

  private getColumns(): XTableColumn<CrgUser | CrgGroup>[] {
    return (this.props.principalType === PrincipalType.USER
      ? this.getUserColumns()
      : this.getGroupColumns()) as XTableColumn<CrgUser | CrgGroup>[];
  }

  private getUserColumns(): XTableColumn<CrgUser>[] {
    return [
      { title: 'Фамилия', field: 'surname', filtering: true, sorting: true },
      { title: 'Имя', field: 'name', filtering: true, sorting: true },
      { title: 'e-mail', field: 'email', filtering: true, sorting: true, getIdBadge: ({ id }) => id }
    ];
  }

  private getGroupColumns(): XTableColumn<CrgGroup>[] {
    return [
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
      }
    ];
  }
}
