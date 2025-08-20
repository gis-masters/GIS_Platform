import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Dataset, datasetSchema, NewDataset } from '../../services/data/vectorData/vectorData.models';
import { createDataset } from '../../services/data/vectorData/vectorData.service';
import { FormDialog } from '../FormDialog/FormDialog';

const cnCreateDataset = cn('CreateDataset');

@observer
export class CreateDataset extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать набор данных'>
          <span>
            <IconButton className={cnCreateDataset()} onClick={this.openDialog}>
              <PlaylistAdd />
            </IconButton>
          </span>
        </Tooltip>

        <FormDialog<Dataset>
          className={cnCreateDataset('Form')}
          open={this.dialogOpen}
          value={{}}
          schema={datasetSchema}
          onClose={this.closeDialog}
          closeWithConfirm
          actionFunction={this.create}
          actionButtonProps={{ children: 'Создать' }}
        />
      </>
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
  private async create(formValue: NewDataset) {
    await createDataset(formValue);

    this.closeDialog();
  }
}
