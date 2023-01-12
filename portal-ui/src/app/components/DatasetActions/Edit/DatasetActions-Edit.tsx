import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable, makeObservable } from 'mobx';
import { IconButton, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';

import { Dataset, datasetSchema, updateDataset } from '../../../services/data/data.service';
import { FormDialog } from '../../FormDialog/FormDialog';
import { getPatch } from '../../../services/util/patch';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';

const cnDatasetActionsEdit = cn('DatasetActions', 'Edit');

interface DatasetActionsEditProps {
  dataset: Dataset;
}

@observer
export class DatasetActionsEdit extends Component<DatasetActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: DatasetActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnDatasetActionsEdit()} onClick={this.openDialog}>
            {this.dialogOpen ? <Edit /> : <EditOutlined />}
          </IconButton>
        </Tooltip>

        <FormDialog
          open={this.dialogOpen}
          schema={datasetSchema}
          value={this.props.dataset}
          actionFunction={this.update}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title='Редактирование данных'
        />
      </>
    );
  }

  @boundMethod
  private async update(value: Dataset) {
    try {
      const patch = getPatch(value, this.props.dataset, Object.keys(value));
      await updateDataset(this.props.dataset, patch);
    } catch (error) {
      const err = error as AxiosError<{ message?: string[] }>;

      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
        services.logger.error(err.response.data.message);
      }
    }
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
