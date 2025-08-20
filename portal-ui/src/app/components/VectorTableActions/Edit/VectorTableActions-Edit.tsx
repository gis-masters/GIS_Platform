import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { VectorTable, vectorTableSchema } from '../../../services/data/vectorData/vectorData.models';
import { updateVectorTable } from '../../../services/data/vectorData/vectorData.service';
import { getPatch } from '../../../services/util/patch';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnVectorTableActionsEdit = cn('VectorTableActions', 'Edit');

interface VectorTableActionsEditProps {
  vectorTable: VectorTable;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class VectorTableActionsEdit extends Component<VectorTableActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: VectorTableActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { vectorTable, disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Редактировать'}>
          <span>
            <IconButton className={cnVectorTableActionsEdit()} onClick={this.openDialog} disabled={disabled}>
              {this.dialogOpen ? <Edit /> : <EditOutlined />}
            </IconButton>
          </span>
        </Tooltip>

        <FormDialog
          open={this.dialogOpen}
          schema={vectorTableSchema}
          value={vectorTable}
          actionFunction={this.update}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          closeWithConfirm
          title='Редактирование векторной таблицы'
        />
      </>
    );
  }

  @boundMethod
  private async update(value: VectorTable) {
    const patch: Partial<VectorTable> = getPatch(value, this.props.vectorTable, Object.keys(value));
    await updateVectorTable(this.props.vectorTable, patch);
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
