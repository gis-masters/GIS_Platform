import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgUser } from '../../../services/auth/users/users.models';
import { UserCreateEditDialog } from '../../UserCreateEditDialog/UserCreateEditDialog';

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
        <UserCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} user={this.props.user} />
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
