import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@material-ui/core';
import { PlaylistAddCheck } from '@material-ui/icons';

import { PrincipalType } from '../../../services/crg/permissions.service';
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
