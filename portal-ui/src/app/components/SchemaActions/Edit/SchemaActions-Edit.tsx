import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Schema, schemaForSchema } from '../../../services/data/schema/schema.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { schemaService } from '../../../services/data/schema/schema.service';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnSchemaActionsEdit = cn('SchemaActions', 'Edit');
const cnSchemaActionsEditDialog = cn('SchemaActions', 'EditDialog');
const cnSchemaActionsEditDialogYes = cn('SchemaActions', 'EditDialogYes');

interface SchemaActionsEditProps {
  schema: Schema;
  as: ActionsItemVariant;
}

@observer
export class SchemaActionsEdit extends Component<SchemaActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: SchemaActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, schema } = this.props;

    return (
      <>
        <ActionsItem
          className={cnSchemaActionsEdit()}
          title='Редактировать'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Edit /> : <EditOutlined />}
        />

        <FormDialog
          className={cnSchemaActionsEditDialog()}
          open={this.dialogOpen}
          schema={schemaForSchema}
          value={{ schema: JSON.stringify(schema, null, 2) }}
          actionFunction={this.save}
          actionButtonProps={{
            startIcon: <SaveOutlined className={cnSchemaActionsEditDialogYes()} />,
            children: 'Сохранить'
          }}
          onClose={this.closeDialog}
          title='Редактирование'
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
  private async save({ schema }: { schema: string }) {
    const parsedSchema = JSON.parse(schema) as Schema;
    await schemaService.updateSchema(parsedSchema);
  }
}
