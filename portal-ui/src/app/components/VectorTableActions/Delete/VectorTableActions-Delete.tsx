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

import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { deleteVectorTable } from '../../../services/data/vectorData/vectorData.service';
import { Button } from '../../Button/Button';

const cnVectorTableActionsDelete = cn('VectorTableActions', 'Delete');

interface VectorTableActionsDeleteProps {
  vectorTable: VectorTable;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class VectorTableActionsDelete extends Component<VectorTableActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading = false;
  @observable private errorMessage?: string;

  constructor(props: VectorTableActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { vectorTable, disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Удалить'}>
          <IconButton
            className={cnVectorTableActionsDelete()}
            onClick={this.openDialog}
            disabled={disabled}
            color='error'
          >
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        {this.errorMessage ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Невозможно удалить</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Понятно</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>Вы действительно хотите удалить "{vectorTable?.title}"?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button loading={this.btnLoading} onClick={this.doDeletion} color='primary'>
                Удалить
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @boundMethod
  private async doDeletion() {
    const { vectorTable } = this.props;
    this.setBtnLoading(true);

    try {
      await deleteVectorTable(vectorTable);
    } catch (error) {
      const err = error as AxiosError;
      this.setErrorMessage(err.message);
    }

    this.closeDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
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
