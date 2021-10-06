import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

import { CrgUser } from '../../../services/crg/users.service';
import { OrgUsersCreateEditDialog } from '../../OrgUsersCreateEditDialog/OrgUsersCreateEditDialog';

const cnOrgActionsEdit = cn('OrgActions', 'Edit');

interface OrgActionsEditProps {
  user: CrgUser;
}

@observer
export class OrgActionsEdit extends Component<OrgActionsEditProps> {
  @observable private dialogOpen = false;

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnOrgActionsEdit()} onClick={this.openDialog}>
            <Edit />
          </IconButton>
        </Tooltip>
        <OrgUsersCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} user={this.props.user} />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
