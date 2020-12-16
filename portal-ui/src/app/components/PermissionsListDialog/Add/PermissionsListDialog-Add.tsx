import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip, IconButton } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

import { PrincipalType } from '../../../services/crg/permissions.models';
import { PermissionsListItem } from '../../../services/crg/allPermissions.service';
import { PermissionsAddDialog } from '../../PermissionsAddDialog/PermissionsAddDialog';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Add.scss';

const cnPermissionsListDialogAdd = cn('PermissionsListDialog', 'Add');

interface PermissionsListDialogAddProps {
  currentList: PermissionsListItem[];
  principalId: number;
  principalType: PrincipalType;
  onAdd: (item: PermissionsListItem[]) => void;
}

@observer
export class PermissionsListDialogAdd extends Component<PermissionsListDialogAddProps> {
  @observable private open = false;

  render() {
    const { currentList, principalId, principalType, onAdd } = this.props;

    return (
      <>
        <Tooltip title='Добавить'>
          <IconButton className={cnPermissionsListDialogAdd()} onClick={this.openDialog}>
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
        <PermissionsAddDialog
          open={this.open}
          onClose={this.closeDialog}
          onAdd={onAdd}
          currentList={currentList}
          principalId={principalId}
          principalType={principalType}
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
