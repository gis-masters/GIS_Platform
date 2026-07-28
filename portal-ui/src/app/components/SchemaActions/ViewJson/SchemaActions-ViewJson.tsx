import React, { useCallback, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ContentCopy, DataObject, DataObjectOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type Schema } from '../../../services/data/schema/schema.models';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { type ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { FormViewValue } from '../../Form/ViewValue/Form-ViewValue';
import { Toast } from '../../Toast/Toast';

import './SchemaActions-ViewJson.scss';

const cnSchemaActionsViewJson = cn('SchemaActions', 'ViewJson');
const cnSchemaActionsViewJsonDialog = cn('SchemaActions', 'ViewJsonDialog');
const cnSchemaActionsViewJsonContent = cn('SchemaActions', 'ViewJsonContent');

interface SchemaActionsViewJsonProps {
  schema: Schema;
  as: ActionsItemVariant;
}

interface SchemaActionsViewJsonState {
  dialogOpen: boolean;

  setDialogOpen(dialogOpen: boolean): void;
}

export const SchemaActionsViewJson = observer(({ schema, as }: SchemaActionsViewJsonProps) => {
  const state = useLocalObservable<SchemaActionsViewJsonState>(() => ({
    dialogOpen: false,

    setDialogOpen(dialogOpen) {
      this.dialogOpen = dialogOpen;
    }
  }));

  const schemaJson = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  const openDialog = useCallback(() => {
    state.setDialogOpen(true);
  }, [state]);

  const closeDialog = useCallback(() => {
    state.setDialogOpen(false);
  }, [state]);

  const copyJson = useCallback(() => {
    copyToClipboard(schemaJson);
    Toast.success('Сохранено в буфер обмена');
  }, [schemaJson]);

  const Icon = state.dialogOpen ? DataObject : DataObjectOutlined;

  return (
    <>
      <ActionsItem
        className={cnSchemaActionsViewJson()}
        title='Просмотр в JSON'
        as={as}
        onClick={openDialog}
        icon={<Icon />}
      />

      <Dialog
        slotProps={{ paper: { className: cnSchemaActionsViewJsonDialog() } }}
        maxWidth='md'
        fullWidth
        open={state.dialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle>{`Просмотр схемы в JSON — ${schema.title}`}</DialogTitle>

        <DialogContent>
          <div className={cnSchemaActionsViewJsonContent()}>
            <FormViewValue code>{schemaJson}</FormViewValue>
          </div>
        </DialogContent>

        <DialogActions>
          <Button startIcon={<ContentCopy />} onClick={copyJson}>
            Копировать
          </Button>
          <Button onClick={closeDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
