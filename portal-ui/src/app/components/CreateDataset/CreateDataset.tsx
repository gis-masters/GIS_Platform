import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { createDataset, Dataset, datasetSchema, NewDataset } from '../../services/data/data.service';

import { FormDialog } from '../FormDialog/FormDialog';

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
          <IconButton onClick={this.openDialog}>
            <PlaylistAdd />
          </IconButton>
        </Tooltip>

        <FormDialog<Dataset>
          open={this.dialogOpen}
          value={{}}
          schema={datasetSchema}
          onClose={this.closeDialog}
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
    try {
      await createDataset(formValue);
    } catch {}
    this.closeDialog();
  }
}
