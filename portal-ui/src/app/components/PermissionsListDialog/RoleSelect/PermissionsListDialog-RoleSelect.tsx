import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Select, MenuItem } from '@material-ui/core';
import { cn } from '@bem-react/classname';

import { Role, PrincipalType, roles, projectRoles, rolesTitles } from '../../../services/crg/permissions.models';
import { PermissionsListItem } from '../../../services/crg/allPermissions.service';
import { filterOutPrincipal } from '../../../services/crg/permissions.service';

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
  render() {
    return (
      <div className={cnPermissionsListRoleSelect()}>
        <Select value={this.value} onChange={this.handleChange}>
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
  private handleChange(e: React.ChangeEvent<{ value: Role }>) {
    const { listItem, onChange, principalId, principalType } = this.props;
    onChange({
      ...listItem,
      permissions: [
        ...filterOutPrincipal(principalId, principalType, listItem.permissions),
        { principalId, principalType, role: e.target.value }
      ]
    });
  }
}
