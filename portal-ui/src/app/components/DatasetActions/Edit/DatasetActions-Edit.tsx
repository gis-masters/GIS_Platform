import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Dataset, datasetSchema } from '../../../services/data/vectorData/vectorData.models';
import { updateDataset } from '../../../services/data/vectorData/vectorData.service';
import { services } from '../../../services/services';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';
import { Toast } from '../../Toast/Toast';

const cnDatasetActionsEdit = cn('DatasetActions', 'Edit');
const cnDatasetActionsEditDialog = cn('DatasetActions', 'EditDialog');
const cnDatasetActionsEditDialogYes = cn('DatasetActions', 'EditDialogYes');

interface DatasetActionsEditProps {
  dataset: Dataset;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class DatasetActionsEdit extends Component<DatasetActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: DatasetActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { dataset, disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Редактировать'}>
          <span>
            <IconButton className={cnDatasetActionsEdit()} onClick={this.openDialog} disabled={disabled}>
              {this.dialogOpen ? <Edit /> : <EditOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <FormDialog
          className={cnDatasetActionsEditDialog()}
          open={this.dialogOpen}
          schema={datasetSchema}
          value={dataset}
          actionFunction={this.update}
          actionButtonProps={{
            startIcon: <SaveOutlined className={cnDatasetActionsEditDialogYes()} />,
            children: 'Сохранить'
          }}
          onClose={this.closeDialog}
          closeWithConfirm
          title='Редактирование набора данных'
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
