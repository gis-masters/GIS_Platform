import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import {
  PermissionType,
  PrincipalType,
  Role,
  RoleAssignmentBody,
  rolesTitles
} from '../../../services/permissions/permissions.models';
import { getRoles } from '../../../services/permissions/permissions.utils';

const cnPermissionsEditDialogRoleSelect = cn('PermissionsEditDialog', 'RoleSelect');

interface PermissionsEditDialogRoleSelectProps {
  principalId: number;
  principalType: PrincipalType;
  currentPermissions: RoleAssignmentBody[];
  permissionType: PermissionType;
  onChange(principalId: number, principalType: PrincipalType, role: Role): void;
}

@observer
export class PermissionsEditDialogRoleSelect extends Component<PermissionsEditDialogRoleSelectProps> {
  constructor(props: PermissionsEditDialogRoleSelectProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Select
        className={cnPermissionsEditDialogRoleSelect()}
        value={this.principalRole}
        onChange={this.handleChange}
        variant='standard'
      >
        {getRoles(this.props.permissionType).map(roleName => (
          <MenuItem value={roleName} key={roleName}>
            {rolesTitles[roleName]}
          </MenuItem>
        ))}
      </Select>
    );
  }

  @computed
  private get principalRole(): Role {
    const { principalId, principalType, currentPermissions, permissionType } = this.props;

    const roles = getRoles(permissionType);

    return currentPermissions.reduce((role: Role, permission: RoleAssignmentBody) => {
      return principalType === permission.principalType &&
        principalId === permission.principalId &&
        roles.indexOf(permission.role) > roles.indexOf(role)
        ? permission.role
        : role;
    }, roles[0]);
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent<Role>) {
    const { onChange, principalId, principalType } = this.props;
    onChange(principalId, principalType, e.target.value as Role);
  }
}
