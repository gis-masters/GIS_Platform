import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { PrincipalType } from '../../../services/crg/permissions.service';

const cnPermissionsEditDialogRemovePrincipal = cn('PermissionsEditDialog', 'RemovePrincipal');

interface PermissionsEditDialogRemovePrincipalProps {
  principalId: number;
  principalType: PrincipalType;
  onRemove: (principalId: number, principalType: PrincipalType) => void;
}

export class PermissionsEditDialogRemovePrincipal extends Component<PermissionsEditDialogRemovePrincipalProps> {
  render() {
    const { principalType } = this.props;

    return (
      <Tooltip title={`Удалить ${principalType === PrincipalType.USER ? 'пользователя' : 'группу'}`}>
        <IconButton className={cnPermissionsEditDialogRemovePrincipal()} onClick={this.handleClick}>
          <Delete />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick() {
    const { onRemove, principalId, principalType } = this.props;
    onRemove(principalId, principalType);
  }
}
