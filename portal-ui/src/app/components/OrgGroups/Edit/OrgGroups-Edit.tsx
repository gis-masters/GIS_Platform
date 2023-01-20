import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

import { CrgUser } from '../../../services/auth/users.service';
import { OrgUsersCreateEditDialog } from '../../OrgUsersCreateEditDialog/OrgUsersCreateEditDialog';

const cnOrgGroupsEdit = cn('OrgGroups', 'Edit');

interface OrgGroupsEditProps {
  user: CrgUser;
}

@observer
export class OrgGroupsEdit extends Component<OrgGroupsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: OrgGroupsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnOrgGroupsEdit()} onClick={this.openDialog}>
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
