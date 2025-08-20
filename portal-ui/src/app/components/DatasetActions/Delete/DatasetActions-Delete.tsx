import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { Dataset } from '../../../services/data/vectorData/vectorData.models';
import { deleteDataset, getVectorTables } from '../../../services/data/vectorData/vectorData.service';
import { achtung, konfirmieren } from '../../../services/utility-dialogs.service';

const cnDatasetActionsDelete = cn('DatasetActions', 'Delete');

interface DatasetActionsDeleteProps {
  dataset: Dataset;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class DatasetActionsDelete extends Component<DatasetActionsDeleteProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;

  constructor(props: DatasetActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { disabled, tooltipText } = this.props;

    return (
      <Tooltip title={disabled && tooltipText ? tooltipText : 'Удалить'}>
        <span>
          <IconButton
            className={cnDatasetActionsDelete()}
            onClick={this.handleDelete}
            disabled={disabled || this.loading}
            color='error'
          >
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private async handleDelete() {
    if (this.loading) {
      return;
    }

    this.setLoading(true);
    this.setDialogOpen(true);

    try {
      const { dataset } = this.props;

      // Проверяем, пустой ли набор данных
      const [records] = await getVectorTables(dataset.identifier, { page: 0, pageSize: 1 });
      if (records.length) {
        await achtung({
          title: 'Невозможно удалить',
          message: 'Набор данных не пустой. Для его удаления необходимо сперва удалить все таблицы внутри.'
        });
        this.setDialogOpen(false);

        return;
      }

      // Запрашиваем подтверждение удаления
      const confirmed = await konfirmieren({
        title: 'Подтверждение удаления',
        message: `Вы действительно хотите удалить "${dataset.title}"?`,
        okText: 'Удалить',
        cancelText: 'Отмена'
      });

      if (confirmed) {
        await deleteDataset(dataset);
      }

      this.setDialogOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      await achtung({
        title: 'Ошибка',
        message: err.response?.data.message || 'Не удалось удалить набор данных'
      });
    } finally {
      this.setLoading(false);
      this.setDialogOpen(false);
    }
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private setDialogOpen(open: boolean) {
    this.dialogOpen = open;
  }
}
