import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { VectorTable, vectorTableSchema, updateVectorTable } from '../../../services/data/data.service';
import { Schema } from '../../../services/data/schema.models';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnVectorTableActionsEdit = cn('VectorTableActions', 'Edit');

interface VectorTableActionsEditProps {
  vectorTable: VectorTable;
}

@observer
export class VectorTableActionsEdit extends Component<VectorTableActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: VectorTableActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Редактировать'>
          <IconButton className={cnVectorTableActionsEdit()} onClick={this.openDialog}>
            {this.dialogOpen ? <Edit /> : <EditOutlined />}
          </IconButton>
        </Tooltip>

        <FormDialog
          open={this.dialogOpen}
          schema={vectorTableSchema as unknown as Schema}
          value={this.props.vectorTable as Partial<VectorTable>}
          actionFunction={this.update}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title='Редактирование данных'
        />
      </>
    );
  }

  @boundMethod
  private async update(value: VectorTable | Record<string, unknown>) {
    const patch: Record<string, unknown> = getPatch(value, this.props.vectorTable, Object.keys(value));
    await updateVectorTable(this.props.vectorTable.dataset, this.props.vectorTable.identifier, patch);
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
