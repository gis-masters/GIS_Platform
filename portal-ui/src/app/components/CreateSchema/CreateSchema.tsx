import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { type Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { IconButton } from '../IconButton/IconButton';
import { SchemaEditDialog } from '../SchemaEditDialog/SchemaEditDialog';

@observer
export class CreateSchema extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  private emptySchema: Schema = {
    name: '',
    title: '',
    description: '',
    properties: []
  };

  render() {
    return (
      <>
        <Tooltip title='Создать схему'>
          <IconButton onClick={this.openDialog}>
            <PlaylistAdd />
          </IconButton>
        </Tooltip>

        <SchemaEditDialog
          title='Создание схемы'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          schema={this.emptySchema}
          onSave={this.create}
          editing
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
  private async create(schema: Schema) {
    await schemaService.createSchema(schema);

    this.closeDialog();
  }
}
