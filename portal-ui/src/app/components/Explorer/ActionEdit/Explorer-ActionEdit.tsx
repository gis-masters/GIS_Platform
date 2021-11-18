import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, EditOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FormDialog } from '../../FormDialog/FormDialog';

import { ExplorerStore } from '../Explorer.store';
import { ActionDetailsEdit } from '../Explorer.models';

const cnExplorerActionEdit = cn('Explorer', 'ActionEdit');

interface ExplorerActionEditProps {
  store: ExplorerStore;
  actionDetails: ActionDetailsEdit;
}

@observer
export class ExplorerActionEdit extends Component<ExplorerActionEditProps> {
  @observable private dialogOpen = false;

  render() {
    const { actionDetails } = this.props;
    const { visible, disabled, fields, actionFunction, payload, dialogTitle, actionButtonProps } = actionDetails;

    return (
      visible && (
        <>
          <Tooltip title='Редактировать'>
            <span>
              <IconButton className={cnExplorerActionEdit()} onClick={this.openDialog} disabled={disabled}>
                {this.dialogOpen ? <Edit /> : <EditOutlined />}
              </IconButton>
            </span>
          </Tooltip>

          <FormDialog
            open={this.dialogOpen}
            fields={fields}
            value={payload as Record<string, string>}
            actionFunction={actionFunction}
            actionButtonProps={actionButtonProps}
            onClose={this.closeDialog}
            title={dialogTitle}
          />
        </>
      )
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
