import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { PermissionsListItem } from '../../../services/crg/permissionsList.service';

const cnPermissionsListDialogActions = cn('PermissionsListDialog', 'Actions');

interface PermissionsListActionsProps {
  item: PermissionsListItem;
  onDelete: (item: PermissionsListItem) => void;
}

@observer
export class PermissionsListActions extends Component<PermissionsListActionsProps> {
  render() {
    return (
      <div className={cnPermissionsListDialogActions()}>
        <Tooltip title='Удалить'>
          <IconButton onClick={this.handleDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  @boundMethod
  private async handleDelete() {
    const { item, onDelete } = this.props;
    onDelete(item);
  }
}
