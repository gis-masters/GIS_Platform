import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
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

import { VectorTable, deleteVectorTable } from '../../../services/data/data.service';
import { Button } from '../../Button/Button';

const cnVectorTableActionsDelete = cn('VectorTableActions', 'Delete');

interface VectorTableActionsDeleteProps {
  vectorTable: VectorTable;
}

@observer
export class VectorTableActionsDelete extends Component<VectorTableActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;

  constructor(props: VectorTableActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnVectorTableActionsDelete()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        {!this.errorMessage ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>Вы действительно хотите удалить "{this.props.vectorTable?.title}"?</DialogContentText>
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
    const { vectorTable } = this.props;
    this.setBtnLoading(true);

    try {
      await deleteVectorTable(vectorTable.dataset, vectorTable.identifier);
    } catch (error) {
      const err = error as AxiosError;
      this.setErrorMessage(err.message);
    }

    this.closeDialog();
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
