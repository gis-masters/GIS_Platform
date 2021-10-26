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
import { deleteItem, isDeleteAllowed } from '../Adapter/Explorer-Adapter';

const cnExplorerActionDelete = cn('Explorer', 'ActionDelete');

interface ExplorerActionDeleteProps {
  store: ExplorerStore;
  actionDetails: ActionDetails;
}

@observer
export class ExplorerActionDelete extends Component<ExplorerActionDeleteProps> {
  @observable private dialogOpen = false;
  @observable private deleteAllowed: boolean;
  @observable private globalLoading = false;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;

  render() {
    const { actionDetails } = this.props;
    const { visible, disabled, needConfirmation, confirmationText, itemTitle } = actionDetails;

    return (
      visible && (
        <>
          <Button
            className={cnExplorerActionDelete()}
            onClick={this.buttonHandler}
            startIcon={this.dialogOpen ? <Delete /> : <DeleteOutline />}
            disabled={disabled}
            color='error'
            loading={this.globalLoading}
          >
            Удалить
          </Button>

          <Dialog open={this.dialogOpen && this.deleteAllowed && needConfirmation} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>{confirmationText}</DialogContentText>
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

    this.setGlobalLoading(false);
    this.setBtnLoading(false);
  }

  @boundMethod
  private async buttonHandler() {
    this.setGlobalLoading(true);
    const { ok, errorMessage } = (await isDeleteAllowed(this.props.store.selectedItem)) || { ok: true };
    this.setDeleteAllowed(ok);
    this.setErrorMessage(errorMessage);
    this.setGlobalLoading(false);

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
  private setGlobalLoading(load: boolean) {
    this.globalLoading = load;
  }
}
