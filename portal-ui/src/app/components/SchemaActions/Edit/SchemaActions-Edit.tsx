import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Edit, EditOutlined, SaveOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { convertNewToOldSchema, convertOldToNewSchema } from '../../../services/data/schema.utils';
import { PropertyType, Schema } from '../../../services/data/schema.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { schemaService } from '../../../services/data/schema.service';
import { OldSchema } from '../../../services/data/schemaOld.models';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnLibraryDocumentActionsEdit = cn('LibraryDocumentActions', 'Edit');

interface SchemaActionsEditProps {
  schema: OldSchema;
  as: ActionsItemVariant;
}

const schemaForSchema: Schema = {
  properties: [
    {
      propertyType: PropertyType.STRING,
      display: 'code',
      name: 'schema',
      validationFormula: (value: string) => {
        try {
          JSON.parse(value);
        } catch {
          return ['Некорректное значение'];
        }
      },
      title: 'Схема'
    }
  ]
};

@observer
export class SchemaActionsEdit extends Component<SchemaActionsEditProps> {
  @observable private dialogOpen = false;

  constructor(props: SchemaActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsEdit()}
          title='Редактировать'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Edit /> : <EditOutlined />}
        />

        <FormDialog
          open={this.dialogOpen}
          schema={schemaForSchema}
          value={{ schema: JSON.stringify(this.newSchema, null, 2) }}
          actionFunction={this.save}
          actionButtonProps={{ startIcon: <SaveOutlined />, children: 'Сохранить' }}
          onClose={this.closeDialog}
          title='Редактирование'
        />
      </>
    );
  }

  private get newSchema() {
    return convertOldToNewSchema(this.props.schema);
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
  private async save(value: Record<string, string>) {
    const parsedSchema = JSON.parse(value.schema) as Schema;
    await schemaService.updateSchema(convertNewToOldSchema(parsedSchema));
  }
}
