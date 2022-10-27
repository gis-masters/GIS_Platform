import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { PrincipalType, Role, RoleAssignmentBody, roles, rolesTitles } from '../../../services/data/permissions.models';

const cnPermissionsEditDialogRoleSelect = cn('PermissionsEditDialog', 'RoleSelect');

interface PermissionsEditDialogRoleSelectProps {
  principalId: number;
  principalType: PrincipalType;
  currentPermissions: RoleAssignmentBody[];
  onChange: (principalId: number, principalType: PrincipalType, role: Role) => void;
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
        value={this.getPrincipalRole}
        onChange={this.changeHandler}
        variant='standard'
      >
        {roles.map(roleName => (
          <MenuItem value={roleName} key={roleName}>
            {rolesTitles[roleName]}
          </MenuItem>
        ))}
      </Select>
    );
  }

  @computed
  private get getPrincipalRole(): Role {
    const { principalId, principalType, currentPermissions } = this.props;

    return currentPermissions.reduce((role: Role, permission: RoleAssignmentBody) => {
      return principalType === permission.principalType &&
        principalId === permission.principalId &&
        roles.indexOf(permission.role) > roles.indexOf(role)
        ? permission.role
        : role;
    }, roles[0]);
  }

  @boundMethod
  private changeHandler(e: SelectChangeEvent<Role>) {
    const { onChange, principalId, principalType } = this.props;
    onChange(principalId, principalType, e.target.value as Role);
  }
}
