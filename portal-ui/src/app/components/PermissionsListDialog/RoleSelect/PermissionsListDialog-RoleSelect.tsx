import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';

import {
  type PermissionsListItem,
  type PrincipalType,
  type Role,
  roles,
  rolesTitles
} from '../../../services/permissions/permissions.models';
import { filterOutPrincipal } from '../../../services/permissions/permissions.utils';

import './PermissionsListDialog-RoleSelect.scss';

const cnPermissionsListRoleSelect = cn('PermissionsListDialog', 'RoleSelect');

interface PermissionsListRoleSelectProps {
  listItem: PermissionsListItem;
  principalId: number;
  principalType: PrincipalType;
  onChange(newItem: PermissionsListItem): void;
}

@observer
export class PermissionsListRoleSelect extends Component<PermissionsListRoleSelectProps> {
  constructor(props: PermissionsListRoleSelectProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnPermissionsListRoleSelect()}>
        <Select value={this.value} onChange={this.handleChange} variant='standard'>
          {roles.map(roleName => (
            <MenuItem value={roleName} key={roleName}>
              {rolesTitles[roleName]}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  @computed
  private get value(): Role {
    return roles[Math.max(...this.props.listItem.permissions.map(({ role }) => roles.indexOf(role)))];
  }

  @action.bound
  private handleChange(e: SelectChangeEvent<Role>) {
    const { listItem, onChange, principalId, principalType } = this.props;
    onChange({
      ...listItem,
      permissions: [
        ...filterOutPrincipal(principalId, principalType, listItem.permissions),
        { principalId, principalType, role: e.target.value as Role }
      ]
    });
  }
}
