import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import { GroupAdd, GroupAddOutlined, PersonAdd, PersonAddOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { CrgUser } from '../../../services/auth/users/users.models';
import {
  PermissionType,
  PrincipalType,
  Role,
  RoleAssignmentBody,
  rolesTitles
} from '../../../services/permissions/permissions.models';
import { getRoles } from '../../../services/permissions/permissions.utils';
import { allGroups } from '../../../stores/AllGroups.store';
import { allUsers } from '../../../stores/AllUsers.store';
import { ActionsRight } from '../../ActionsRight/ActionsRight';
import { Button } from '../../Button/Button';
import { XTable } from '../../XTable/XTable';
import { XTableColumn } from '../../XTable/XTable.models';
import { PermissionsEditDialogCheckPrincipal } from '../CheckPrincipal/PermissionsEditDialog-CheckPrincipal';

import '!style-loader!css-loader!sass-loader!../AddPrincipalTable/PermissionsEditDialog-AddPrincipalTable.scss';

const cnPermissionsEditDialog = cn('PermissionsEditDialog');

interface PermissionsEditDialogAddPrincipalProps {
  principalType: PrincipalType;
  currentPrincipals: (CrgUser | CrgGroup)[];
  permissionType: PermissionType;
  onAdd(permissions: RoleAssignmentBody[]): void;
}

@observer
export class PermissionsEditDialogAddPrincipal extends Component<PermissionsEditDialogAddPrincipalProps> {
  @observable private dialogOpen = false;
  @observable private role: Role = Role.VIEWER;
  @observable private selectedPrincipals: (CrgUser | CrgGroup)[] = [];

  @computed
  private get cols(): XTableColumn<CrgUser | CrgGroup>[] {
    return [
      {
        title: (
          <Checkbox
            indeterminate={this.selectedPrincipals.length > 0 && !this.selectedAll}
            checked={this.selectedAll}
            onChange={this.handleSelectAll}
          />
        ),
        cellProps: { padding: 'checkbox' },
        CellContent: this.renderCheckbox
      },
      ...this.getColumns()
    ];
  }

  constructor(props: PermissionsEditDialogAddPrincipalProps) {
    super(props);
    makeObservable(this);
  }

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
            <ActionsRight>
              <Select value={this.role} onChange={this.handleRoleChange} variant='standard'>
                {getRoles(this.props.permissionType).map(roleName => (
                  <MenuItem value={roleName} key={roleName}>
                    {rolesTitles[roleName]}
                  </MenuItem>
                ))}
              </Select>
              <Button onClick={this.handleAdd} color='primary' disabled={!this.selectedPrincipals.length}>
                Добавить
              </Button>
              <Button onClick={this.close}>Отмена</Button>
            </ActionsRight>
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
  private handleRoleChange(e: SelectChangeEvent<Role>) {
    this.role = e.target.value as Role;
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
  private renderCheckbox({ rowData }: { rowData: CrgUser | CrgGroup }): ReactElement {
    return (
      <PermissionsEditDialogCheckPrincipal
        principal={rowData}
        selectedPrincipals={this.selectedPrincipals}
        availablePrincipals={this.availablePrincipals}
      />
    );
  }

  private getColumns(): XTableColumn<CrgUser | CrgGroup>[] {
    return (
      this.props.principalType === PrincipalType.USER ? this.getUserColumns() : this.getGroupColumns()
    ) as XTableColumn<CrgUser | CrgGroup>[];
  }

  private getUserColumns(): XTableColumn<CrgUser>[] {
    return [
      { title: 'Фамилия', field: 'surname', filterable: true, sortable: true },
      { title: 'Имя', field: 'name', filterable: true, sortable: true },
      { title: 'e-mail', field: 'email', filterable: true, sortable: true, getIdBadge: ({ id }) => id }
    ];
  }

  private getGroupColumns(): XTableColumn<CrgGroup>[] {
    return [
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
      }
    ];
  }
}
