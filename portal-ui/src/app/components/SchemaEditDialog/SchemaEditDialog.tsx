import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { EditNoteOutlined, SaveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { debounce, type DebouncedFunc } from 'lodash';

import { doConfirm } from '../../services/answer-modals.service';
import { type Library } from '../../services/data/library/library.models';
import { updateLibrarySchema } from '../../services/data/library/library.service';
import {
  type PropertySchema,
  PropertyType,
  type Schema,
  schemaForSchema
} from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { applyAsTitleToSchema } from '../../services/data/schema/utils/applyAsTitleToSchema';
import { ensureGeometryTypeOption } from '../../services/data/schema/utils/ensureGeometryTypeOption';
import { isReadableProperty } from '../../services/data/schema/utils/isReadableProperty';
import { DataEntityType, type VectorTable } from '../../services/data/vectorData/vectorData.models';
import { updateVectorTableSchema } from '../../services/data/vectorData/vectorData.service';
import { GeometryType, type SupportedGeometryType } from '../../services/geoserver/wfs/wfs.models';
import { FormFieldErrorsError } from '../../services/util/form/FormFieldErrorsError';
import { getSchemaTagsOptions } from '../../services/util/form/getSchemaTagsOptions';
import { isArray } from '../../services/util/typeGuards/isArray';
import { isArrayOf } from '../../services/util/typeGuards/isArrayOf';
import { isAxiosError } from '../../services/util/typeGuards/isAxiosError';
import { isRecordStringUnknown } from '../../services/util/typeGuards/isRecordStringUnknown';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { FormDialog } from '../FormDialog/FormDialog';
import { SchemaActionsPreview } from '../SchemaActions/Preview/SchemaActions-Preview';
import { SchemaCard } from '../SchemaCard/SchemaCard';
import { SchemaPropertiesControl } from '../SchemaPropertiesControl/SchemaPropertiesControl';

import './SchemaEditDialog.scss';

const cnSchemaEditDialog = cn('SchemaEditDialog');

function parseTags(tags: unknown): string[] {
  if (isArray(tags)) {
    return tags.filter((tag): tag is string => typeof tag === 'string');
  }

  if (typeof tags !== 'string') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(tags);

    return isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === 'string') : [];
  } catch {
    return [];
  }
}

function isSchemaSaveFieldError(value: unknown): value is { field?: string; message?: string } {
  if (!isRecordStringUnknown(value)) {
    return false;
  }

  return (
    (value.field === undefined || typeof value.field === 'string') &&
    (value.message === undefined || typeof value.message === 'string')
  );
}

function getSchemaSaveErrorMessage(error: unknown, properties?: PropertySchema[]): string {
  const data = isAxiosError(error) ? error.response?.data : undefined;

  if (!isRecordStringUnknown(data)) {
    return 'Ошибка сохранения схемы';
  }

  const { errors, message } = data;
  const errorsMessages: string[] = [];

  if (isArrayOf(errors, isSchemaSaveFieldError)) {
    errors.forEach(({ field, message: fieldMessage }) => {
      let errorMessage = '';

      if (field) {
        const matches = field.match(/\[(\d+)]/);

        if (matches && matches.length > 1) {
          const propertyIndex = Number.parseInt(matches[1], 10);

          if (propertyIndex) {
            const property = properties?.[propertyIndex];
            errorMessage = property?.name ? `Ошибка в поле ${property.name}: ` : '';
          }
        }
      }

      if (fieldMessage) {
        errorMessage += fieldMessage;
      }

      if (errorMessage) {
        errorsMessages.push(errorMessage);
      }
    });
  }

  if (errorsMessages.length) {
    return errorsMessages.join('. ');
  }

  if (typeof message === 'string' && message) {
    return message;
  }

  return 'Ошибка сохранения схемы';
}

export interface SchemaEditDialogProps {
  open: boolean;
  onClose(): void;
  schema: Schema;
  title?: string;
  explorerItem?: Library | VectorTable;
  readonly?: boolean;
  editing?: boolean;
  withPreview?: boolean;
  onSave?(schema: Schema): Promise<void>;
}

interface SchemaEditDialogState {
  loading: boolean;
  jsonMode: boolean;
  currentSchema: Schema | undefined;
  schemaString: string;
  error: string;
  warnings: string[];
  isSchemaChanged: boolean;
  isCreateMode: boolean;

  setIsCreateMode(isCreateMode: boolean): void;
  setLoading(loading: boolean): void;
  setJsonMode(jsonMode: boolean): void;
  setCurrentSchema(currentSchema: Schema | undefined): void;
  setSchemaString(schemaString: string): void;
  setError(error: string): void;
  setWarnings(warnings: string[]): void;
  setIsSchemaChanged(isSchemaChanged: boolean): void;
}

type SchemaCreateFormValue = Pick<
  Schema,
  | 'name'
  | 'title'
  | 'description'
  | 'tableName'
  | 'originName'
  | 'readOnly'
  | 'properties'
  | 'geometryType'
  | 'styleName'
  | 'tags'
> & {
  asTitle?: string;
};

const ensureShapeProperty = (
  properties: PropertySchema[] = [],
  geometryType?: SupportedGeometryType
): PropertySchema[] => {
  const propertiesWithoutShape = properties.filter(property => property.name !== 'shape');

  if (!geometryType) {
    return propertiesWithoutShape;
  }

  return [
    ...propertiesWithoutShape,
    {
      name: 'shape',
      title: 'Геометрия',
      hidden: true,
      propertyType: PropertyType.GEOMETRY
    }
  ];
};

const getAsTitlePropertyName = (properties: PropertySchema[] = []): string | undefined => {
  return properties.find(property => property.asTitle === true)?.name;
};

const createSchemaFields = (properties: PropertySchema[] = []): PropertySchema[] => [
  {
    name: 'name',
    title: 'Идентификатор',
    required: true,
    minLength: 1,
    maxLength: 63,
    regex: '^[a-z][a-z0-9_]*$',
    regexErrorMessage: 'Только строчные латинские буквы, цифры и "_". Первый символ должен быть буквой.',
    description: 'Системное наименование схемы (пишется маленькими буквами, латиницей и без пробелов)',
    propertyType: PropertyType.STRING
  },
  {
    name: 'title',
    title: 'Название',
    required: true,
    description: 'Русскоязычное название схемы',
    propertyType: PropertyType.STRING
  },
  {
    name: 'description',
    title: 'Описание',
    description: 'Краткое описание назначения схемы',
    propertyType: PropertyType.STRING
  },
  {
    name: 'tableName',
    title: 'Наименование таблицы',
    hidden: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'originName',
    title: 'Идентификатор',
    hidden: true,
    propertyType: PropertyType.STRING
  },
  {
    name: 'readOnly',
    title: 'Только для чтения',
    description: 'Запрещает пользовательское редактирование данных созданных по схеме',
    propertyType: PropertyType.BOOL
  },
  {
    name: 'geometryType',
    title: 'Тип геометрии',
    dynamicPropertyFormula: ensureGeometryTypeOption,
    options: [
      {
        title: 'Без геометрии',
        value: ''
      },
      {
        value: GeometryType.POINT,
        title: 'Точка'
      },
      {
        value: GeometryType.MULTI_LINE_STRING,
        title: 'Линия'
      },
      {
        value: GeometryType.MULTI_POLYGON,
        title: 'Полигон'
      }
    ],
    propertyType: PropertyType.CHOICE
  },
  {
    name: 'styleName',
    title: 'Стиль',
    description: 'Наименование стиля для отображения геометрии',
    propertyType: PropertyType.STRING
  },
  {
    name: 'tags',
    title: 'Теги',
    description: 'Теги схемы',
    multiple: true,
    options: getSchemaTagsOptions(),
    propertyType: PropertyType.CHOICE
  },
  {
    name: 'asTitle',
    title: 'Заголовок объекта',
    description: 'Показывать значение выбранного поля как заголовок для объекта',
    options: properties.filter(isReadableProperty).map(property => ({
      title: property.title || property.name,
      value: property.name
    })),
    propertyType: PropertyType.CHOICE
  },
  {
    name: 'properties',
    title: 'Свойства',
    description: 'Набор полей для хранения сведений — значимых характеристик объектов',
    propertyType: PropertyType.CUSTOM,
    ControlComponent: SchemaPropertiesControl
  }
];

export const SchemaEditDialog = observer((props: SchemaEditDialogProps) => {
  const {
    title,
    open,
    onClose,
    schema,
    explorerItem,
    readonly = false,
    editing: editIcon,
    withPreview,
    onSave
  } = props;

  const state = useLocalObservable<SchemaEditDialogState>(() => ({
    loading: false,
    jsonMode: false,
    currentSchema: schema,
    schemaString: JSON.stringify(schema, null, 2),
    error: '',
    warnings: [],
    isSchemaChanged: false,
    isCreateMode: !schema.name,

    setIsCreateMode(isCreateMode) {
      this.isCreateMode = isCreateMode;
    },

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
      state.setIsCreateMode(!schema.name);
    }

    wasDialogOpenRef.current = open;
  }, [
    open,
    schema,
    state.setCurrentSchema,
    state.setSchemaString,
    state.setIsSchemaChanged,
    state.setIsCreateMode,
    state
  ]);

  const toggleJsonMode = useCallback(() => {
    state.setJsonMode(!state.jsonMode);
  }, [state]);

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSetCurrentSchema = useCallback(
    (nextSchema: Schema) => {
      state.setCurrentSchema(nextSchema);
      state.setIsSchemaChanged(true);

      if (!state.jsonMode) {
        state.setSchemaString(JSON.stringify(nextSchema, null, 2));
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
    async (nextSchema: Schema) => {
      if (!explorerItem) {
        await schemaService.updateSchema(nextSchema);

        return;
      }

      if (explorerItem.type === DataEntityType.LIBRARY) {
        await updateLibrarySchema(explorerItem, nextSchema);

        return;
      }

      if (explorerItem.type === DataEntityType.TABLE) {
        await updateVectorTableSchema(explorerItem, nextSchema);
      }
    },
    [explorerItem]
  );

  const confirmSchemaWarnings = useCallback(async () => {
    if (state.warnings.length === 0) {
      return true;
    }

    return doConfirm({
      title: 'Предупреждения по схеме',
      message: (
        <>
          <p>Перед сохранением обнаружены предупреждения:</p>
          <ul className={cnSchemaEditDialog('ConfirmWarningList')}>
            {state.warnings.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
          <p>{state.isCreateMode ? 'Создать схему?' : 'Сохранить схему?'}</p>
        </>
      ),
      okText: state.isCreateMode ? 'Всё равно создать' : 'Всё равно сохранить',
      cancelText: 'Вернуться к редактированию'
    });
  }, [state]);

  const save = useCallback(async () => {
    if (!state.currentSchema) {
      state.setError('Ошибка сохранения схемы');

      return;
    }

    if (!(await confirmSchemaWarnings())) {
      return;
    }

    state.setLoading(true);

    try {
      await (onSave ? onSave(state.currentSchema) : updateSchema(state.currentSchema));

      state.setLoading(false);
      closeDialog();
    } catch (error) {
      state.setError(getSchemaSaveErrorMessage(error, state.currentSchema?.properties));
      state.setLoading(false);
    }
  }, [closeDialog, confirmSchemaWarnings, onSave, state, updateSchema]);

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

  const handleCreateFormChange = useCallback(
    (value: SchemaCreateFormValue) => {
      const { asTitle, ...schemaValue } = value;

      const nextValue = {
        ...schemaValue,
        properties: value.properties ?? state.currentSchema?.properties ?? schema.properties
      };

      if (value.name) {
        nextValue.tableName = value.name;
        nextValue.originName = value.name;
      }

      handleSetCurrentSchema(
        applyAsTitleToSchema(
          {
            ...state.currentSchema,
            ...nextValue
          } as Schema,
          asTitle
        )
      );
    },
    [handleSetCurrentSchema, schema.properties, state]
  );

  const createSchema = useCallback(
    async (value: SchemaCreateFormValue) => {
      const { asTitle, ...schemaValue } = value;

      const nextSchema: Schema = applyAsTitleToSchema(
        {
          ...schema,
          ...state.currentSchema,
          ...schemaValue,
          tableName: value.tableName || value.name,
          originName: value.originName || value.name,
          tags: parseTags(value.tags),
          properties: ensureShapeProperty(
            value.properties ?? state.currentSchema?.properties ?? schema.properties,
            value.geometryType
          )
        },
        asTitle ?? getAsTitlePropertyName(value.properties ?? state.currentSchema?.properties)
      );

      state.setCurrentSchema(nextSchema);

      await (onSave ? onSave(nextSchema) : updateSchema(nextSchema));
    },
    [schema, state, onSave, updateSchema]
  );

  const createSchemaFromJson = useCallback(async () => {
    if (!state.currentSchema) {
      state.setError('Ошибка сохранения схемы');

      return;
    }

    if (!(await confirmSchemaWarnings())) {
      return;
    }

    state.setLoading(true);

    try {
      await createSchema(state.currentSchema);
      state.setLoading(false);
      closeDialog();
    } catch (error) {
      state.setError(getSchemaSaveErrorMessage(error, state.currentSchema?.properties));
      state.setLoading(false);
    }
  }, [closeDialog, confirmSchemaWarnings, createSchema, state]);

  const createSchemaFromForm = useCallback(
    async (value: SchemaCreateFormValue) => {
      if (!(await confirmSchemaWarnings())) {
        throw new FormFieldErrorsError([{ field: '__schemaWarningsAborted' }]);
      }

      await createSchema(value);
    },
    [confirmSchemaWarnings, createSchema]
  );

  const schemaMessages = (state.warnings.length > 0 || state.error) && (
    <div className={cnSchemaEditDialog('Messages')}>
      {state.warnings.map((line, index) => (
        <div key={index} className={cnSchemaEditDialog('Warning')}>
          {line}
        </div>
      ))}

      {state.error && <div className={cnSchemaEditDialog('Error')}>{state.error}</div>}
    </div>
  );

  if (state.isCreateMode && !state.jsonMode) {
    return (
      <FormDialog<SchemaCreateFormValue>
        open={open}
        title={title}
        schema={{
          properties: createSchemaFields(state.currentSchema?.properties ?? [])
        }}
        value={
          state.currentSchema
            ? {
                ...state.currentSchema,
                asTitle: getAsTitlePropertyName(state.currentSchema.properties)
              }
            : undefined
        }
        actionFunction={createSchemaFromForm}
        onFormChange={handleCreateFormChange}
        actionButtonProps={{ children: 'Создать' }}
        closeButtonProps={{ children: 'Отмена' }}
        onClose={closeDialog}
        afterForm={schemaMessages}
        additionalAction={
          <Button
            className={cnSchemaEditDialog('JsonToggle')}
            startIcon={<EditNoteOutlined />}
            onClick={toggleJsonMode}
          >
            Редактировать в JSON
          </Button>
        }
        closeWithConfirm
      />
    );
  }

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

        {schemaMessages}
      </DialogContent>

      <DialogActions>
        {!readonly && (
          <Button
            className={cnSchemaEditDialog('Save')}
            color='primary'
            loading={state.loading}
            startIcon={<SaveOutlined />}
            onClick={state.isCreateMode ? createSchemaFromJson : save}
          >
            {state.isCreateMode ? 'Создать' : 'Сохранить'}
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
