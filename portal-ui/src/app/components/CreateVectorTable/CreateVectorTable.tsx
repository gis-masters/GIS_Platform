import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import {
  Dataset,
  emptyVectorTableSchema,
  NewVectorTable,
  VectorTable
} from '../../services/data/vectorData/vectorData.models';
import { createVectorTable } from '../../services/data/vectorData/vectorData.service';
import { FormDialog } from '../FormDialog/FormDialog';

import { CreateVectorTableButton } from './Button/CreateVectorTable-Button';

const cnCreateVectorTableDialog = cn('CreateVectorTableDialog');
const cnCreateVectorTableDialogYes = cn('CreateVectorTableDialog', 'Yes');

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
          className={cnCreateVectorTableDialog()}
          open={this.dialogOpen}
          schema={emptyVectorTableSchema}
          actionFunction={this.create}
          actionButtonProps={{
            startIcon: <SaveOutlined className={cnCreateVectorTableDialogYes()} />,
            children: 'Создать'
          }}
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
  private async create(formValue: NewVectorTable) {
    await createVectorTable(this.props.dataset.identifier, formValue);

    this.closeDialog();
  }
}
