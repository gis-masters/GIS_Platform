import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { IconButton, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';

import { Dataset, datasetSchema, updateDataset } from '../../../services/data.service';
import { Schema } from '../../../services/crg/schema.models';
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
          schema={datasetSchema as unknown as Schema}
          value={this.props.dataset as Partial<Dataset>}
          actionFunction={this.update}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title='Редактирование данных'
        />
      </>
    );
  }

  @boundMethod
  private async update(value: Dataset | Record<string, unknown>) {
    try {
      const patch: Record<string, unknown> = getPatch(value, this.props.dataset, Object.keys(value));
      await updateDataset(String(this.props.dataset?.identifier), patch);
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
