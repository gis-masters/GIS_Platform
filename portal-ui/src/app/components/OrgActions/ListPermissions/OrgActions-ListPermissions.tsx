import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@mui/material';
import { PlaylistAddCheck } from '@mui/icons-material';

import { PrincipalType } from '../../../services/data/permissions.models';
import { PermissionsListDialog } from '../../PermissionsListDialog/PermissionsListDialog';

const cnOrgActionsListPermissions = cn('OrgActions', 'ListPermissions');

interface OrgActionsListPermissionsProps {
  principalId: number;
  principalType: PrincipalType;
  principalName: string;
}

@observer
export class OrgActionsListPermissions extends Component<OrgActionsListPermissionsProps> {
  @observable private open = false;

  constructor(props: OrgActionsListPermissionsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { principalId, principalName, principalType } = this.props;

    return (
      <>
        <Tooltip title='Разрешения'>
          <IconButton className={cnOrgActionsListPermissions()} onClick={this.openDialog}>
            <PlaylistAddCheck />
          </IconButton>
        </Tooltip>
        <PermissionsListDialog
          open={this.open}
          onClose={this.closeDialog}
          principalId={principalId}
          principalType={principalType}
          principalName={principalName}
        />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.open = true;
  }

  @action.bound
  private closeDialog() {
    this.open = false;
  }
}
