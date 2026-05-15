import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { EditNoteOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type AxiosError } from 'axios';
import { debounce, type DebouncedFunc } from 'lodash';

import { doConfirm } from '../../services/answer-modals.service';
import { type Library } from '../../services/data/library/library.models';
import { updateLibrarySchema } from '../../services/data/library/library.service';
import { type Schema, schemaForSchema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { DataEntityType, type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { updateVectorTableSchema } from '../../services/data/vectorData/vectorData.service';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { SchemaActionsPreview } from '../SchemaActions/Preview/SchemaActions-Preview';
import { SchemaCard } from '../SchemaCard/SchemaCard';

import './SchemaEditDialog.scss';

const cnSchemaEditDialog = cn('SchemaEditDialog');

export interface SchemaEditDialogProps {
  title: string;
  open: boolean;
  onClose(): void;
  schema: Schema;
  explorerItem?: Library | VectorTable;
  readonly?: boolean;
  editing?: boolean;
  withPreview?: boolean;
}

interface SchemaEditDialogState {
  loading: boolean;
  jsonMode: boolean;
  currentSchema: Schema | undefined;
  schemaString: string;
  error: string;
  warnings: string[];
  isSchemaChanged: boolean;

  setLoading(loading: boolean): void;
  setJsonMode(jsonMode: boolean): void;
  setCurrentSchema(currentSchema: Schema | undefined): void;
  setSchemaString(schemaString: string): void;
  setError(error: string): void;
  setWarnings(warnings: string[]): void;
  setIsSchemaChanged(isSchemaChanged: boolean): void;
}

export const SchemaEditDialog = observer((props: SchemaEditDialogProps) => {
  const { title, open, onClose, schema, explorerItem, readonly = false, editing: editIcon, withPreview } = props;

  const state = useLocalObservable<SchemaEditDialogState>(() => ({
    loading: false,
    jsonMode: false,
    currentSchema: schema,
    schemaString: JSON.stringify(schema, null, 2),
    error: '',
    warnings: [],
    isSchemaChanged: false,

    setLoading(loading) {
      this.loading = loading;
    },
    setJsonMode(jsonMode) {
      this.jsonMode = jsonMode;
    },
    setCurrentSchema(currentSchema) {
      this.currentSchema = currentSchema;
    },
    setSchemaString(schemaString) {
      this.schemaString = schemaString;
    },
    setError(error) {
      this.error = error;
    },
    setWarnings(warnings) {
      this.warnings = warnings;
    },
    setIsSchemaChanged(isSchemaChanged) {
      this.isSchemaChanged = isSchemaChanged;
    }
  }));

  const prevJsonMode = useRef(state.jsonMode);
  const prevDialogOpen = useRef(open);
  const wasDialogOpenRef = useRef(false);
  const schemaWarningRunIdRef = useRef(0);
  const debouncedSchemaWarningsRef = useRef<DebouncedFunc<(s: Schema, runId: number) => void> | null>(null);

  if (!debouncedSchemaWarningsRef.current) {
    debouncedSchemaWarningsRef.current = debounce((s: Schema, runId: number) => {
      void (async () => {
        try {
          const next = await schemaService.getSchemaWarnings(s);
          if (runId === schemaWarningRunIdRef.current) {
            state.setWarnings(next);
          }
        } catch {
          if (runId === schemaWarningRunIdRef.current) {
            state.setWarnings([]);
          }
        }
      })();
    }, 500);
  }

  useEffect(() => {
    if (!open && !state.isSchemaChanged) {
      state.setCurrentSchema(schema);
      state.setSchemaString(JSON.stringify(schema, null, 2));
    }
  }, [schema, open, state.isSchemaChanged, state.setCurrentSchema, state.setSchemaString, state]);

  useEffect(() => {
    state.setIsSchemaChanged(false);
  }, [open, state.setIsSchemaChanged, state]);

  useEffect(() => {
    const jsonModeJustEnabled = !prevJsonMode.current && state.jsonMode;
    const dialogJustOpened = !prevDialogOpen.current && open;

    if ((jsonModeJustEnabled || dialogJustOpened) && state.jsonMode) {
      state.setSchemaString(JSON.stringify(state.currentSchema ?? schema, null, 2));
    }

    prevJsonMode.current = state.jsonMode;
    prevDialogOpen.current = open;
  }, [state.currentSchema, open, state.jsonMode, schema, state.setSchemaString, state]);

  useEffect(() => {
    if (!open) {
      state.setError('');
      state.setWarnings([]);
      state.setJsonMode(false);
    }
  }, [open, state.setError, state.setJsonMode, state.setWarnings, state]);

  useEffect(() => {
    const debounced = debouncedSchemaWarningsRef.current;
    if (!debounced) {
      return;
    }

    if (!open || !state.currentSchema) {
      debounced.cancel();
      schemaWarningRunIdRef.current += 1;
      state.setWarnings([]);

      return;
    }

    schemaWarningRunIdRef.current += 1;
    const runId = schemaWarningRunIdRef.current;
    debounced(state.currentSchema, runId);

    return () => {
      debounced.cancel();
    };
  }, [open, state, state.currentSchema]);

  useEffect(() => {
    if (open && !wasDialogOpenRef.current) {
      state.setCurrentSchema(schema);
      state.setSchemaString(JSON.stringify(schema, null, 2));
      state.setIsSchemaChanged(false);
    }
    wasDialogOpenRef.current = open;
  }, [open, schema, state.setCurrentSchema, state.setSchemaString, state.setIsSchemaChanged, state]);

  const toggleJsonMode = useCallback(() => {
    state.setJsonMode(!state.jsonMode);
  }, [state]);

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSetCurrentSchema = useCallback(
    (schema: Schema) => {
      state.setCurrentSchema(schema);
      state.setIsSchemaChanged(true);
      if (!state.jsonMode) {
        state.setSchemaString(JSON.stringify(schema, null, 2));
      }
    },
    [state]
  );

  const handleSetError = useCallback(
    (errorMsg: string) => {
      state.setError(errorMsg);
    },
    [state]
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
    if (!state.currentSchema) {
      state.setError('Ошибка сохранения схемы');

      return;
    }

    if (state.warnings.length > 0) {
      const saveAnyway = await doConfirm({
        title: 'Предупреждения по схеме',
        message: (
          <>
            <p>Перед сохранением обнаружены предупреждения:</p>
            <ul className={cnSchemaEditDialog('ConfirmWarningList')}>
              {state.warnings.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
            <p>Сохранить схему?</p>
          </>
        ),
        okText: 'Всё равно сохранить',
        cancelText: 'Вернуться к редактированию'
      });

      if (!saveAnyway) {
        return;
      }
    }

    state.setLoading(true);

    try {
      await updateSchema(state.currentSchema);
      state.setLoading(false);
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
              const property = state.currentSchema?.properties[propertyIndex];
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

      state.setError(errorsMessages.length ? errorsMessages.join('. ') : 'Ошибка сохранения схемы');
      state.setLoading(false);
    }
  }, [closeDialog, state, updateSchema]);

  const handleJsonChange = useCallback(
    ({ schema: schemaJson }: { schema: string }) => {
      state.setSchemaString(schemaJson);
      state.setError('');

      try {
        const parsedSchema = JSON.parse(schemaJson) as Schema;
        state.setCurrentSchema(parsedSchema);
        state.setIsSchemaChanged(true);
      } catch {
        state.setError('Ошибка изменения схемы');
        state.setWarnings([]);
      }
    },
    [state]
  );

  return (
    <Dialog
      slotProps={{ paper: { className: cnSchemaEditDialog() } }}
      maxWidth='md'
      fullWidth
      open={open}
      onClose={closeDialog}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {state.currentSchema &&
          (state.jsonMode ? (
            <Form
              className={cnSchemaEditDialog('InJsonForm')}
              schema={schemaForSchema}
              value={{ schema: state.schemaString }}
              onFormChange={handleJsonChange}
              labelInField
            />
          ) : (
            <SchemaCard
              readonly={readonly}
              editing={editIcon}
              onSchemaChange={handleSetCurrentSchema}
              onError={handleSetError}
              schema={state.currentSchema}
            />
          ))}

        {(state.warnings.length > 0 || state.error) && (
          <div className={cnSchemaEditDialog('Messages')}>
            {state.warnings.map((line, index) => (
              <div key={index} className={cnSchemaEditDialog('Warning')}>
                {line}
              </div>
            ))}
            {state.error && <div className={cnSchemaEditDialog('Error')}>{state.error}</div>}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        {!readonly && (
          <Button
            className={cnSchemaEditDialog('Save')}
            color='primary'
            loading={state.loading}
            startIcon={<SaveOutlined />}
            onClick={save}
          >
            Сохранить
          </Button>
        )}

        {withPreview && state.currentSchema && <SchemaActionsPreview schema={state.currentSchema} as='button' />}

        {!readonly && (
          <Button
            className={cnSchemaEditDialog('JsonToggle')}
            startIcon={<EditNoteOutlined />}
            onClick={toggleJsonMode}
          >
            {state.jsonMode ? 'Редактировать в интерфейсе' : 'Редактировать в JSON'}
          </Button>
        )}
        <Button onClick={closeDialog}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
});
