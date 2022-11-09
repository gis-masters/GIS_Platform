import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { SaveOutlined } from '@mui/icons-material';

import { createVectorTable, Dataset, emptyVectorTableSchema, VectorTable } from '../../services/data/data.service';
import { Schema } from '../../services/data/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';

import { CreateVectorTableButton } from './Button/CreateVectorTable-Button';

interface CreateVectorTableProps {
  dataset: Dataset;
}

@observer
export class CreateVectorTable extends Component<CreateVectorTableProps> {
  @observable private dialogOpen = false;

  constructor(props: CreateVectorTableProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <CreateVectorTableButton onClick={this.openDialog} />

        <FormDialog<Partial<VectorTable>>
          open={this.dialogOpen}
          schema={emptyVectorTableSchema as unknown as Schema}
          actionFunction={this.create}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Создать' }}
          onClose={this.closeDialog}
          title='Создание нового слоя'
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
  private async create(formValue: VectorTable) {
    await createVectorTable(this.props.dataset, formValue);
    this.closeDialog();
  }
}
