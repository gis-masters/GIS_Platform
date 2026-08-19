import React, { useCallback } from 'react';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { FileCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type Schema } from '../../../services/data/schema/schema.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import { type ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { SchemaEditDialog } from '../../SchemaEditDialog/SchemaEditDialog';

const cnSchemaActionsCopy = cn('SchemaActions', 'Copy');

interface SchemaActionsCopyProps {
  as: ActionsItemVariant;
  schema: Schema;
}

interface SchemaActionsCopyState {
  dialogOpen: boolean;
  schemaCopy: Schema | null;

  setDialogOpen(dialogOpen: boolean): void;
  setSchemaCopy(schemaCopy: Schema | null): void;
}

export const SchemaActionsCopy = observer(({ as, schema }: SchemaActionsCopyProps) => {
  const state = useLocalObservable<SchemaActionsCopyState>(() => ({
    dialogOpen: false,
    schemaCopy: null,

    setDialogOpen(dialogOpen) {
      this.dialogOpen = dialogOpen;
    },
    setSchemaCopy(schemaCopy) {
      this.schemaCopy = schemaCopy;
    }
  }));

  const openDialog = useCallback(() => {
    state.setSchemaCopy({
      ...toJS(schema),
      name: '',
      originName: '',
      tableName: ''
    });
    state.setDialogOpen(true);
  }, [schema, state]);

  const closeDialog = useCallback(() => {
    state.setDialogOpen(false);
    state.setSchemaCopy(null);
  }, [state]);

  const copy = useCallback(
    async (newSchema: Schema) => {
      await schemaService.createSchema(newSchema);
      closeDialog();
    },
    [closeDialog]
  );

  return (
    <>
      <ActionsItem
        className={cnSchemaActionsCopy()}
        title='Создать копию схемы'
        as={as}
        onClick={openDialog}
        icon={<FileCopyOutlined />}
      />

      {state.schemaCopy && (
        <SchemaEditDialog
          title='Создание схемы'
          open={state.dialogOpen}
          onClose={closeDialog}
          schema={state.schemaCopy}
          onSave={copy}
          editing
        />
      )}
    </>
  );
});
