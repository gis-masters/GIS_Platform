import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {
  Edit,
  EditNoteOutlined,
  EditOutlined,
  SaveOutlined,
  Schema as SchemaIcon,
  SchemaOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import { isEqual } from 'lodash';

import { Library } from '../../../services/data/library/library.models';
import { updateLibrarySchema } from '../../../services/data/library/library.service';
import { Schema, schemaForSchema } from '../../../services/data/schema/schema.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import { DataEntityType, VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { updateVectorTableSchema } from '../../../services/data/vectorData/vectorData.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';
import { SchemaCard } from '../../SchemaCard/SchemaCard';
import { SchemaActionsPreview } from '../Preview/SchemaActions-Preview';

import '!style-loader!css-loader!sass-loader!../EditInJsonForm/SchemaActions-EditInJsonForm.scss';
import '!style-loader!css-loader!sass-loader!../Error/SchemaActions-Error.scss';

const cnSchemaActionsEdit = cn('SchemaActions', 'Edit');
const cnSchemaActionsError = cn('SchemaActions', 'Error');
const cnSchemaActionsEditDialog = cn('SchemaActions', 'EditDialog');
const cnSchemaActionsEditDialogYes = cn('SchemaActions', 'EditDialogYes');

const cnSchemaActionsEditInJson = cn('SchemaActions', 'EditInJson');
const cnSchemaActionsEditInJsonForm = cn('SchemaActions', 'EditInJsonForm');

interface SchemaActionsEditProps {
  schema: Schema;
  as: ActionsItemVariant;
  item?: Library | VectorTable;
  withPreview?: boolean;
  readonly?: boolean;
  isTemplateEditing?: boolean;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class SchemaActionsEdit extends Component<SchemaActionsEditProps> {
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private jsonMode = false;
  @observable private currentSchema?: Schema;
  @observable private error?: string;

  constructor(props: SchemaActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount(): void {
    this.setCurrentSchema(this.props.schema);
  }

  componentDidUpdate(prevProps: SchemaActionsEditProps) {
    if (!isEqual(prevProps.schema, this.props.schema)) {
      this.setCurrentSchema(this.props.schema);
    }
  }

  render() {
    const { as, withPreview, isTemplateEditing: editIcon, readonly = false, disabled, tooltipText } = this.props;
    const icons = [
      [SchemaOutlined, SchemaIcon],
      [EditOutlined, Edit]
    ];
    const Icon = icons[Number(!!editIcon)][Number(this.dialogOpen)];

    return (
      <>
        <ActionsItem
          className={cnSchemaActionsEdit()}
          title={disabled ? tooltipText || this.buttonTitle : this.buttonTitle}
          as={as}
          onClick={this.openDialog}
          icon={<Icon />}
          disabled={disabled}
        />

        <Dialog
          className={cnSchemaActionsEditDialog()}
          maxWidth='md'
          fullWidth
          open={this.dialogOpen}
          onClose={this.closeDialog}
        >
          <DialogTitle>{this.schemaEditTitle}</DialogTitle>

          <DialogContent>
            {this.currentSchema &&
              (this.jsonMode ? (
                <Form
                  className={cnSchemaActionsEditInJsonForm()}
                  schema={schemaForSchema}
                  value={{ schema: JSON.stringify(this.currentSchema, null, 2) }}
                  onFormChange={this.handleJsonChange}
                  labelInField
                />
              ) : (
                <SchemaCard
                  readonly={readonly}
                  onSchemaChange={this.setCurrentSchema}
                  onError={this.setError}
                  schema={this.currentSchema}
                />
              ))}

            {this.error && <div className={cnSchemaActionsError()}>{this.error}</div>}
          </DialogContent>

          <DialogActions>
            {!readonly && (
              <ActionsItem
                className={cnSchemaActionsEditDialogYes()}
                title={'Сохранить'}
                as='button'
                color='primary'
                onClick={this.save}
                icon={<SaveOutlined />}
                loading={this.loading}
              />
            )}

            {withPreview && this.currentSchema && <SchemaActionsPreview schema={this.currentSchema} as='button' />}

            {!readonly && (
              <ActionsItem
                className={cnSchemaActionsEditInJson()}
                title={this.jsonMode ? 'Редактировать в интерфейсе' : 'Редактировать в JSON'}
                as='button'
                onClick={this.toggleJsonMode}
                icon={<EditNoteOutlined />}
              />
            )}
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @computed
  private get buttonTitle(): string {
    const { readonly, isTemplateEditing: editIcon } = this.props;

    if (editIcon) {
      return 'Редактировать';
    }

    return readonly ? 'Просмотр схемы' : 'Редактировать схему';
  }

  @computed
  private get schemaEditTitle() {
    const { readonly, item: explorerItem, schema } = this.props;
    const title = readonly ? 'Просмотр схемы' : 'Редактирование схемы';

    if (explorerItem?.type === DataEntityType.LIBRARY && explorerItem?.title) {
      return `${title} библиотеки ${explorerItem.title}`;
    }

    if (explorerItem?.type === DataEntityType.TABLE && explorerItem?.title) {
      return `${title} векторной таблицы ${explorerItem.title}`;
    }

    return `${title} ${schema.title}`;
  }

  @action.bound
  private toggleJsonMode() {
    this.jsonMode = !this.jsonMode;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    this.setError('');
  }

  @action.bound
  private setCurrentSchema(currentSchema: Schema) {
    this.currentSchema = currentSchema;
  }

  @action.bound
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  private setError(error: string): void {
    this.error = error;
  }

  @action.bound
  private async save() {
    if (!this.currentSchema) {
      this.setError('Ошибка сохранения схемы');

      return;
    }

    this.setLoading(true);

    try {
      await this.updateSchema(this.currentSchema);

      this.setLoading(false);
      this.closeDialog();
    } catch (error) {
      const err = error as AxiosError<{ errors?: [{ field: string; message: string }] }>;
      const errorsMessages: string[] = [];
      err.response?.data?.errors?.forEach(({ field, message }) => {
        let errorMessage: string = '';

        if (field) {
          const regex = /\[(\d+)]/;
          const matches = field.match(regex);

          if (matches && matches.length > 1) {
            const propertyIndex = Number.parseInt(matches[1], 10);

            if (propertyIndex) {
              const property = this.currentSchema?.properties[propertyIndex];
              errorMessage = property?.name ? `Ошибка в поле ${property.name}: ` : '';
            }
          }
        }

        if (message) {
          errorMessage += message;
        }

        if (errorMessage) {
          errorsMessages.push(errorMessage);
        }
      });

      this.setError(errorsMessages.length ? errorsMessages.join('. ') : 'Ошибка сохранения схемы');
      this.setLoading(false);
    }
  }

  @boundMethod
  private handleJsonChange({ schema }: { schema: string }) {
    this.setError('');

    try {
      const parsedSchema = JSON.parse(schema) as Schema;
      this.setCurrentSchema(parsedSchema);
    } catch {
      this.setError('Ошибка изменения схемы');
    }
  }

  private async updateSchema(schema: Schema) {
    const { item: explorerItem } = this.props;

    if (!explorerItem) {
      await schemaService.updateSchema(schema);
    }

    if (explorerItem?.type === DataEntityType.LIBRARY) {
      await updateLibrarySchema(explorerItem, schema);
    }

    if (explorerItem?.type === DataEntityType.TABLE) {
      await updateVectorTableSchema(explorerItem, schema);
    }
  }
}
