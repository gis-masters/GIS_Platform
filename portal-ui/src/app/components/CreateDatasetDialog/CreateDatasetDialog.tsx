import React, { Component } from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Dataset, datasetSchema } from '../../services/data/vectorData/vectorData.models';
import { createDataset } from '../../services/data/vectorData/vectorData.service';
import { FormDialog } from '../FormDialog/FormDialog';
import { Toast } from '../Toast/Toast';

const cnCreateDatasetDialog = cn('CreateDatasetDialog');

interface CreateDatasetDialogProps {
  open: boolean;
  onClose(): void;
  onCreated(): void;
}

export class CreateDatasetDialog extends Component<CreateDatasetDialogProps> {
  render() {
    const { open, onClose } = this.props;

    return (
      <FormDialog
        className={cnCreateDatasetDialog()}
        open={open}
        onClose={onClose}
        closeWithConfirm
        title='Создание нового набора данных'
        actionFunction={this.create}
        schema={datasetSchema}
        actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Создать' }}
      />
    );
  }

  @boundMethod
  private async create(value: Dataset) {
    await createDataset(value);
    Toast.info(`Успешно создан набор данных: \n"${value.title}"`);
    this.props.onCreated();
  }
}
