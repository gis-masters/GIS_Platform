import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
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
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Dataset } from '../../../services/data/vectorData/vectorData.models';
import { deleteDataset, getVectorTables } from '../../../services/data/vectorData/vectorData.service';
import { Button } from '../../Button/Button';

const cnDatasetActionsDelete = cn('DatasetActions', 'Delete');
const cnDatasetActionsDeleteDialogYes = cn('DatasetActions', 'DeleteDialogYes');
const cnDatasetActionsDeleteProhibitDeletionDialog = cn('DatasetActions', 'DeleteProhibitDeletionDialog');

interface DatasetActionsDeleteProps {
  dataset: Dataset;
}

@observer
export class DatasetActionsDelete extends Component<DatasetActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private busy = false;
  @observable private deleteAllowed = false;
  @observable private btnLoading = false;
  @observable private errorMessage = '';

  constructor(props: DatasetActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { dataset } = this.props;

    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnDatasetActionsDelete()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        {this.busy || Boolean(this.deleteAllowed) ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>Вы действительно хотите удалить "{dataset.title}"?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                loading={this.btnLoading}
                onClick={this.doDeletion}
                color='primary'
                className={cnDatasetActionsDeleteDialogYes()}
              >
                Удалить
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            open={this.dialogOpen}
            onClose={this.closeDialog}
            className={cnDatasetActionsDeleteProhibitDeletionDialog()}
          >
            <DialogTitle>Невозможно удалить</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Понятно</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
    void this.testEmptiness();
  }

  @boundMethod
  private async testEmptiness() {
    const { dataset } = this.props;

    const [records] = await getVectorTables(dataset.identifier, { page: 0, pageSize: 1 });

    this.setDeleteAllowed(!records.length);
    this.setErrorMessage(
      records.length ? 'Набор данных не пустой. Для его удаления необходимо сперва удалить все таблицы внутри.' : ''
    );
  }

  @boundMethod
  private async doDeletion() {
    const { dataset } = this.props;
    this.setBtnLoading(true);
    try {
      await deleteDataset(dataset);
      this.setErrorMessage('');
      this.closeDialog();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      this.setErrorMessage(err.response?.data.message || '');
    }

    this.setDeleteAllowed(false);
    this.setBtnLoading(false);
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;

    this.setBusy(false);
    this.setBtnLoading(false);
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.btnLoading = load;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  @action.bound
  private setDeleteAllowed(allowed: boolean) {
    this.deleteAllowed = allowed;
  }
}
