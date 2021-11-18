import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import { ExplorerStore } from '../Explorer.store';
import { ActionDetailsDelete } from '../Explorer.models';
import { deleteItem, isDeleteAllowed } from '../Adapter/Explorer-Adapter';

const cnExplorerActionDelete = cn('Explorer', 'ActionDelete');

interface ExplorerActionDeleteProps {
  store: ExplorerStore;
  actionDetails: ActionDetailsDelete;
}

@observer
export class ExplorerActionDelete extends Component<ExplorerActionDeleteProps> {
  @observable private dialogOpen = false;
  @observable private deleteAllowed: boolean;
  @observable private busy = false;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;

  render() {
    const { actionDetails } = this.props;
    const { visible, disabled, needConfirmation, confirmationText, itemTitle } = actionDetails;

    return (
      visible && (
        <>
          <Tooltip title='Удалить'>
            <span>
              <IconButton
                className={cnExplorerActionDelete()}
                onClick={this.buttonHandler}
                disabled={disabled || this.busy}
                color='error'
              >
                {this.dialogOpen ? <Delete /> : <DeleteOutline />}
              </IconButton>
            </span>
          </Tooltip>

          <Dialog open={this.dialogOpen && this.deleteAllowed && needConfirmation} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              {confirmationText && <DialogContentText>{confirmationText}</DialogContentText>}
              <DialogContentText>Вы действительно хотите удалить "{itemTitle}"?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button loading={this.btnLoading} onClick={this.doDeletion} color='primary'>
                Удалить
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={this.dialogOpen && !this.deleteAllowed && needConfirmation} onClose={this.closeDialog}>
            <DialogTitle>Невозможно удалить</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Понятно</Button>
            </DialogActions>
          </Dialog>
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

    this.setBusy(false);
    this.setBtnLoading(false);
  }

  @boundMethod
  private async buttonHandler() {
    this.setBusy(true);
    const { ok, errorMessage } = (await isDeleteAllowed(this.props.store.selectedItem)) || { ok: true };
    this.setDeleteAllowed(ok);
    this.setErrorMessage(errorMessage);
    this.setBusy(false);

    if (this.props.actionDetails.needConfirmation) {
      this.openDialog();
    } else {
      void this.doDeletion();
    }
  }

  @boundMethod
  private async doDeletion() {
    this.setBtnLoading(true);
    await deleteItem(this.props.store.selectedItem);
    this.setErrorMessage('');
    this.setDeleteAllowed(false);
    this.setBtnLoading(false);
    this.closeDialog();
  }

  @action.bound
  private setDeleteAllowed(allowed: boolean) {
    this.deleteAllowed = allowed;
  }

  @action.bound
  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.btnLoading = load;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
