import React, { Component } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

const cnPermissionsListDialogActions = cn('PermissionsListDialog', 'Actions');

interface PermissionsListActionsProps {
  id: string | number;
  additionalId?: string;
  onDelete(id: string | number, additionalId?: string): void;
}

export class PermissionsListActions extends Component<PermissionsListActionsProps> {
  render() {
    return (
      <div className={cnPermissionsListDialogActions()}>
        <Tooltip title='Удалить'>
          <IconButton onClick={this.handleDelete}>
            <DeleteOutline color='error' />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  @boundMethod
  private handleDelete() {
    const { id, onDelete, additionalId } = this.props;
    onDelete(id, additionalId);
  }
}
