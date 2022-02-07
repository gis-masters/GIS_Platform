import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Delete, DeleteOutline } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { DataTable, deleteDataTable } from '../../../services/data.service';
import { Button } from '../../Button/Button';

const cnDataTableActionsDelete = cn('DataTableActions', 'Delete');

interface DataTableActionsDeleteProps {
  dataTable: DataTable;
}

@observer
export class DataTableActionsDelete extends Component<DataTableActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;
  render() {
    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnDataTableActionsDelete()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        {!this.errorMessage ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>Вы действительно хотите удалить "{this.props.dataTable?.title}"?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button loading={this.btnLoading} onClick={this.doDeletion} color='primary'>
                Удалить
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
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
  }

  @boundMethod
  private async doDeletion() {
    const { dataTable } = this.props;
    this.setBtnLoading(true);

    try {
      await deleteDataTable(dataTable.dataset, dataTable.identifier);
    } catch (error) {
      const err = error as AxiosError;
      this.setErrorMessage(err.message);
    }

    this.setBtnLoading(false);
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;

    this.setErrorMessage('');
    this.setBtnLoading(false);
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.btnLoading = load;
  }

  @action.bound
  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
