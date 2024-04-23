import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { Schema, schemaForSchema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { FormDialog } from '../FormDialog/FormDialog';

@observer
export class CreateSchema extends Component {
  @observable private dialogOpen = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать схему'>
          <IconButton onClick={this.openDialog}>
            <PlaylistAdd />
          </IconButton>
        </Tooltip>

        <FormDialog<{ schema: string }>
          open={this.dialogOpen}
          value={{}}
          schema={schemaForSchema}
          onClose={this.closeDialog}
          actionFunction={this.create}
          actionButtonProps={{ children: 'Создать' }}
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
  private async create({ schema }: { schema: string }) {
    const parsedSchema = JSON.parse(schema) as Schema;
    await schemaService.createSchema(parsedSchema);
  }
}
