import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Preview, PreviewOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PropertyType, Schema } from '../../../services/data/schema/schema.models';
import { generateObjectBySchema } from '../../../services/util/generateObjectBySchema';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';

import '!style-loader!css-loader!sass-loader!../PreviewDialogSubmitButton/SchemaActions-PreviewDialogSubmitButton.scss';

const cnSchemaActionsPreview = cn('SchemaActions', 'Preview');
const cnSchemaActionsPreviewDialog = cn('SchemaActions', 'PreviewDialog');
const cnSchemaActionsPreviewDialogSubmitButton = cn('SchemaActions', 'PreviewDialogSubmitButton');

interface SchemaActionsPreviewProps {
  schema: Schema;
  as: ActionsItemVariant;
}

function dummy() {
  throw new Error('Так может выглядеть ошибка');
}

@observer
export class SchemaActionsPreview extends Component<SchemaActionsPreviewProps> {
  @observable private dialogOpen = false;

  constructor(props: SchemaActionsPreviewProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { schema, as } = this.props;
    const clonedSchema = { ...schema };
    clonedSchema.properties = schema.properties.filter(
      ({ propertyType }) => ![PropertyType.GEOMETRY, PropertyType.LOOKUP].includes(propertyType)
    );

    return (
      <>
        <ActionsItem
          className={cnSchemaActionsPreview()}
          title={'Предпросмотр'}
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Preview /> : <PreviewOutlined />}
        />

        <FormDialog
          className={cnSchemaActionsPreviewDialog()}
          open={this.dialogOpen}
          schema={clonedSchema}
          //рандомные значения для предпросмотра схемы
          value={{ ...generateObjectBySchema(clonedSchema), id: 789, libraryTableName: 'library_dl_database3' }}
          actionFunction={dummy}
          actionButtonProps={{
            className: cnSchemaActionsPreviewDialogSubmitButton()
          }}
          closeButtonProps={{
            children: 'Закрыть'
          }}
          onClose={this.closeDialog}
          title={`Предпросмотр формы по схеме — ${schema.name}`}
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
}
