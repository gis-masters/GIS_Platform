import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import { ExplorerStore } from '../Explorer.store';
import { ActionDetails } from '../Explorer.models';
import { deleteItem } from '../Adapter/Explorer-Adapter';

const cnExplorerActionDelete = cn('Explorer', 'ActionDelete');

interface ExplorerActionDeleteProps {
  store: ExplorerStore;
  actionDetails: ActionDetails;
}

@observer
export class ExplorerActionDelete extends Component<ExplorerActionDeleteProps> {
  @observable private dialogOpen = false;

  render() {
    const { actionDetails } = this.props;
    const { visible, disabled, needConfirmation, confirmationText } = actionDetails;

    return (
      visible && (
        <>
          <Button
            className={cnExplorerActionDelete()}
            onClick={this.buttonHandler}
            startIcon={this.dialogOpen ? <Delete /> : <DeleteOutline />}
            disabled={disabled}
            color='error'
          >
            Удалить
          </Button>

          {needConfirmation && (
            <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
              <DialogTitle>Удалить?</DialogTitle>
              <DialogContent>
                <DialogContentText>{confirmationText}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.doDeletion} color='primary'>
                  Удалить
                </Button>
                <Button onClick={this.closeDialog}>Отмена</Button>
              </DialogActions>
            </Dialog>
          )}
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

  @boundMethod
  private buttonHandler() {
    if (this.props.actionDetails.needConfirmation) {
      this.openDialog();
    } else {
      void this.doDeletion();
    }
  }

  @boundMethod
  private async doDeletion() {
    this.closeDialog();
    await deleteItem(this.props.store.selectedItem);
  }
}
