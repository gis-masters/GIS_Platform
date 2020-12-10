import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MenuItem, Select } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { PrincipalType, Role, RoleAssignmentBody, roles, rolesTitles } from '../../../services/crg/permissions.models';

const cnPermissionsEditDialogRoleSelect = cn('PermissionsEditDialog', 'RoleSelect');

interface PermissionsEditDialogRoleSelectProps {
  principalId: number;
  principalType: PrincipalType;
  currentPermissions: RoleAssignmentBody[];
  onChange: (principalId: number, principalType: PrincipalType, role: Role) => void;
}

@observer
export class PermissionsEditDialogRoleSelect extends Component<PermissionsEditDialogRoleSelectProps> {
  render() {
    return (
      <Select
        className={cnPermissionsEditDialogRoleSelect()}
        value={this.getPrincipalRole()}
        onChange={this.changeHandler}
      >
        {roles.map(roleName => (
          <MenuItem value={roleName} key={roleName}>
            {rolesTitles[roleName]}
          </MenuItem>
        ))}
      </Select>
    );
  }

  private getPrincipalRole(): Role {
    const { principalId, principalType, currentPermissions } = this.props;
    return currentPermissions.reduce((role: Role, permission: RoleAssignmentBody) => {
      if (
        principalType === permission.principalType &&
        principalId === permission.principalId &&
        roles.indexOf(permission.role) > roles.indexOf(role)
      ) {
        return permission.role;
      } else {
        return role;
      }
    }, roles[0]);
  }

  @boundMethod
  private changeHandler(e: React.ChangeEvent<{ value: Role }>) {
    const { onChange, principalId, principalType } = this.props;
    onChange(principalId, principalType, e.target.value);
  }
}
