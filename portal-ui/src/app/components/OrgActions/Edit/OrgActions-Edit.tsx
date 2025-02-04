import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../../services/auth/groups/groups.models';
import { CrgUser } from '../../../services/auth/users/users.models';
import { OrgGroupsCreateEditDialog } from '../../OrgGroupCreateEditDialog/OrgGroupsCreateEditDialog';
import { UserCreateEditDialog } from '../../UserCreateEditDialog/UserCreateEditDialog';

const cnOrgActionsEdit = cn('OrgActions', 'Edit');

interface OrgActionsEditProps {
  user?: CrgUser;
  group?: CrgGroup;
}

@observer
export class OrgActionsEdit extends Component<OrgActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: OrgActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnOrgActionsEdit()} onClick={this.openDialog}>
            <Edit />
          </IconButton>
        </Tooltip>
        {this.props.group ? (
          <OrgGroupsCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} group={this.props.group} />
        ) : (
          <UserCreateEditDialog open={this.dialogOpen} onClose={this.closeDialog} user={this.props.user} />
        )}
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
