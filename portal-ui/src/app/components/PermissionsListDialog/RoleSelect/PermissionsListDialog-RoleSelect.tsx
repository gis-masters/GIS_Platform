import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Role, PrincipalType, roles, projectRoles, rolesTitles } from '../../../services/data/permissions.models';
import { PermissionsListItem } from '../../../services/data/allPermissions.service';
import { filterOutPrincipal } from '../../../services/data/permissions.service';

import { PermissionsListItemType } from '../PermissionsListDialog.models';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-RoleSelect.scss';

const cnPermissionsListRoleSelect = cn('PermissionsListDialog', 'RoleSelect');

interface PermissionsListRoleSelectProps {
  listItem: PermissionsListItem;
  onChange: (newItem: PermissionsListItem) => void;
  principalId: number;
  principalType: PrincipalType;
  listItemType: PermissionsListItemType;
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
          {this.roles.map(roleName => (
            <MenuItem value={roleName} key={roleName}>
              {rolesTitles[roleName]}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  @computed
  private get roles(): Role[] {
    return this.props.listItemType === PermissionsListItemType.PROJECT ? projectRoles : roles;
  }

  @computed
  private get value(): Role {
    return this.roles[Math.max(...this.props.listItem.permissions.map(({ role }) => this.roles.indexOf(role)))];
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
