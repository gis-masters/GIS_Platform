import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
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
import { type AxiosError } from 'axios';

import { type Library } from '../../../services/data/library/library.models';
import { updateLibrarySchema } from '../../../services/data/library/library.service';
import { type Schema, schemaForSchema } from '../../../services/data/schema/schema.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import { DataEntityType, type VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { updateVectorTableSchema } from '../../../services/data/vectorData/vectorData.service';
import { type ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Form } from '../../Form/Form';
import { SchemaCard } from '../../SchemaCard/SchemaCard';
import { SchemaActionsPreview } from '../Preview/SchemaActions-Preview';

import '../EditInJsonForm/SchemaActions-EditInJsonForm.scss';
import '../Error/SchemaActions-Error.scss';

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

interface SchemaActionsEditState {
  loading: boolean;
  dialogOpen: boolean;
  jsonMode: boolean;
  currentSchema: Schema | undefined;
  schemaString: string;
  error: string;
  isSchemaChanged: boolean;

  setLoading(loading: boolean): void;
  setDialogOpen(dialogOpen: boolean): void;
  setJsonMode(jsonMode: boolean): void;
  setCurrentSchema(currentSchema: Schema | undefined): void;
  setSchemaString(schemaString: string): void;
  setError(error: string): void;
  setIsSchemaChanged(isSchemaChanged: boolean): void;
}

export const SchemaActionsEdit = observer((props: SchemaActionsEditProps) => {
  const {
    schema: propSchema,
    as,
    item: explorerItem,
    withPreview,
    readonly = false,
    isTemplateEditing: editIcon,
    disabled,
    tooltipText
  } = props;

  const {
    loading,
    dialogOpen,
    jsonMode,
    currentSchema,
    schemaString,
    error,
    isSchemaChanged,
    setLoading,
    setDialogOpen,
    setJsonMode,
    setCurrentSchema,
    setSchemaString,
    setError,
    setIsSchemaChanged
  } = useLocalObservable(
    (): SchemaActionsEditState => ({
      loading: false,
      dialogOpen: false,
      jsonMode: false,
      currentSchema: propSchema,
      schemaString: JSON.stringify(propSchema, null, 2),
      error: '',
      isSchemaChanged: false,

      setLoading(this: SchemaActionsEditState, loading: boolean): void {
        this.loading = loading;
      },
      setDialogOpen(this: SchemaActionsEditState, dialogOpen: boolean): void {
        this.dialogOpen = dialogOpen;
      },
      setJsonMode(this: SchemaActionsEditState, jsonMode: boolean): void {
        this.jsonMode = jsonMode;
      },
      setCurrentSchema(this: SchemaActionsEditState, currentSchema: Schema | undefined): void {
        this.currentSchema = currentSchema;
      },
      setSchemaString(this: SchemaActionsEditState, schemaString: string): void {
        this.schemaString = schemaString;
      },
      setError(this: SchemaActionsEditState, error: string): void {
        this.error = error;
      },
      setIsSchemaChanged(this: SchemaActionsEditState, isSchemaChanged: boolean): void {
        this.isSchemaChanged = isSchemaChanged;
      }
    })
  );

  const icons = [
    [SchemaOutlined, SchemaIcon],
    [EditOutlined, Edit]
  ];

  const Icon = icons[Number(!!editIcon)][Number(dialogOpen)];

  const prevJsonMode = useRef(jsonMode);
  const prevDialogOpen = useRef(dialogOpen);

  useEffect(() => {
    if (!dialogOpen && !isSchemaChanged) {
      setCurrentSchema(propSchema);
      setSchemaString(JSON.stringify(propSchema, null, 2));
    }
  }, [propSchema, dialogOpen, isSchemaChanged, setCurrentSchema, setSchemaString]);

  useEffect(() => {
    setIsSchemaChanged(false);
  }, [dialogOpen, setIsSchemaChanged]);

  useEffect(() => {
    const jsonModeJustEnabled = !prevJsonMode.current && jsonMode;
    const dialogJustOpened = !prevDialogOpen.current && dialogOpen;

    if ((jsonModeJustEnabled || dialogJustOpened) && jsonMode) {
      setSchemaString(JSON.stringify(currentSchema ?? propSchema, null, 2));
    }

    prevJsonMode.current = jsonMode;
    prevDialogOpen.current = dialogOpen;
  }, [currentSchema, dialogOpen, jsonMode, propSchema, setSchemaString]);

  const buttonTitle = useMemo(() => {
    if (editIcon) {
      return 'Редактировать';
    }

    return readonly ? 'Просмотр схемы' : 'Редактировать схему';
  }, [editIcon, readonly]);

  const schemaEditTitle = useMemo(() => {
    const title = readonly ? 'Просмотр схемы' : 'Редактирование схемы';

    if (explorerItem?.type === DataEntityType.LIBRARY && explorerItem?.title) {
      return `${title} библиотеки ${explorerItem.title}`;
    }

    if (explorerItem?.type === DataEntityType.TABLE && explorerItem?.title) {
      return `${title} векторной таблицы ${explorerItem.title}`;
    }

    return `${title} ${propSchema.title}`;
  }, [readonly, explorerItem, propSchema.title]);

  const toggleJsonMode = useCallback(() => {
    setJsonMode(!jsonMode);
  }, [jsonMode, setJsonMode]);

  const openDialog = useCallback(() => {
    setDialogOpen(true);
    setCurrentSchema(propSchema);
    setSchemaString(JSON.stringify(propSchema, null, 2));
    setIsSchemaChanged(false);
  }, [propSchema, setDialogOpen, setCurrentSchema, setSchemaString, setIsSchemaChanged]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setError('');
    setJsonMode(false);
    setIsSchemaChanged(false);
  }, [setDialogOpen, setError, setJsonMode, setIsSchemaChanged]);

  const handleSetCurrentSchema = useCallback(
    (schema: Schema) => {
      setCurrentSchema(schema);
      setIsSchemaChanged(true);
      if (!jsonMode) {
        setSchemaString(JSON.stringify(schema, null, 2));
      }
    },
    [setCurrentSchema, setSchemaString, jsonMode, setIsSchemaChanged]
  );

  const handleSetError = useCallback(
    (errorMsg: string) => {
      setError(errorMsg);
    },
    [setError]
  );

  const updateSchema = useCallback(
    async (schema: Schema) => {
      if (!explorerItem) {
        await schemaService.updateSchema(schema);

        return;
      }

      if (explorerItem.type === DataEntityType.LIBRARY) {
        await updateLibrarySchema(explorerItem, schema);

        return;
      }

      if (explorerItem.type === DataEntityType.TABLE) {
        await updateVectorTableSchema(explorerItem, schema);
      }
    },
    [explorerItem]
  );

  const save = useCallback(async () => {
    if (!currentSchema) {
      setError('Ошибка сохранения схемы');

      return;
    }

    setLoading(true);

    try {
      await updateSchema(currentSchema);
      setLoading(false);
      closeDialog();
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
              const property = currentSchema?.properties[propertyIndex];
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

      setError(errorsMessages.length ? errorsMessages.join('. ') : 'Ошибка сохранения схемы');
      setLoading(false);
    }
  }, [closeDialog, currentSchema, setError, setLoading, updateSchema]);

  const handleJsonChange = useCallback(
    ({ schema: schemaJson }: { schema: string }) => {
      setSchemaString(schemaJson);
      setError('');

      try {
        const parsedSchema = JSON.parse(schemaJson) as Schema;
        setCurrentSchema(parsedSchema);
        setIsSchemaChanged(true);
      } catch {
        setError('Ошибка изменения схемы');
      }
    },
    [setCurrentSchema, setError, setSchemaString, setIsSchemaChanged]
  );

  return (
    <>
      <ActionsItem
        className={cnSchemaActionsEdit()}
        title={disabled ? tooltipText || buttonTitle : buttonTitle}
        as={as}
        onClick={openDialog}
        icon={<Icon />}
        disabled={disabled}
      />

      <Dialog className={cnSchemaActionsEditDialog()} maxWidth='md' fullWidth open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{schemaEditTitle}</DialogTitle>

        <DialogContent>
          {currentSchema &&
            (jsonMode ? (
              <Form
                className={cnSchemaActionsEditInJsonForm()}
                schema={schemaForSchema}
                value={{ schema: schemaString }}
                onFormChange={handleJsonChange}
                labelInField
              />
            ) : (
              <SchemaCard
                readonly={readonly}
                onSchemaChange={handleSetCurrentSchema}
                onError={handleSetError}
                schema={currentSchema}
              />
            ))}

          {error && <div className={cnSchemaActionsError()}>{error}</div>}
        </DialogContent>

        <DialogActions>
          {!readonly && (
            <ActionsItem
              className={cnSchemaActionsEditDialogYes()}
              title={'Сохранить'}
              as='button'
              color='primary'
              onClick={save}
              icon={<SaveOutlined />}
              loading={loading}
            />
          )}

          {withPreview && currentSchema && <SchemaActionsPreview schema={currentSchema} as='button' />}

          {!readonly && (
            <ActionsItem
              className={cnSchemaActionsEditInJson()}
              title={jsonMode ? 'Редактировать в интерфейсе' : 'Редактировать в JSON'}
              as='button'
              onClick={toggleJsonMode}
              icon={<EditNoteOutlined />}
            />
          )}
          <Button onClick={closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
