import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { DataTable, dataTableSchema, updateDataTable } from '../../../services/data.service';
import { Schema } from '../../../services/crg/schema.models';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnDataTableActionsEdit = cn('DataTableActions', 'Edit');

interface DataTableActionsEditProps {
  dataTable: DataTable;
}

@observer
export class DataTableActionsEdit extends Component<DataTableActionsEditProps> {
  @observable private dialogOpen = false;

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnDataTableActionsEdit()} onClick={this.openDialog}>
            {this.dialogOpen ? <Edit /> : <EditOutlined />}
          </IconButton>
        </Tooltip>

        <FormDialog
          open={this.dialogOpen}
          schema={dataTableSchema as unknown as Schema}
          value={this.props.dataTable as Partial<DataTable>}
          actionFunction={this.update}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title='Редактирование данных'
        />
      </>
    );
  }

  @boundMethod
  private async update(value: DataTable | Record<string, unknown>) {
    const patch: Record<string, unknown> = getPatch(value, this.props.dataTable, Object.keys(value));
    await updateDataTable(this.props.dataTable.dataset, this.props.dataTable.identifier, patch);
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
