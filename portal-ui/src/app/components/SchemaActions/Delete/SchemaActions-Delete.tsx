import React, { useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { doConfirm } from '../../../services/answer-modals.service';
import type { Schema } from '../../../services/data/schema/schema.models';
import { schemaService } from '../../../services/data/schema/schema.service';
import type { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnSchemaActionsDelete = cn('SchemaActions', 'Delete');

interface SchemaActionsDeleteProps {
  schema: Schema;
  as: ActionsItemVariant;
  disabled?: boolean;
  tooltipText?: string;
}

interface SchemaActionsDeleteState {
  dialogOpen: boolean;

  setDialogOpen(dialogOpen: boolean): void;
}

export const SchemaActionsDelete = observer((props: SchemaActionsDeleteProps) => {
  const { schema, as, disabled, tooltipText } = props;

  const state = useLocalObservable<SchemaActionsDeleteState>(() => ({
    dialogOpen: false,

    setDialogOpen(dialogOpen) {
      this.dialogOpen = dialogOpen;
    }
  }));

  const handleDelete = useCallback(async () => {
    state.setDialogOpen(true);

    try {
      const confirmed = await doConfirm({
        title: 'Подтверждение удаления',
        message: <p>Вы действительно хотите удалить "{schema.title}"?</p>,
        okText: 'Удалить',
        cancelText: 'Отмена'
      });

      if (confirmed) {
        await schemaService.deleteSchema(schema);
      }
    } finally {
      state.setDialogOpen(false);
    }
  }, [schema, state]);

  return (
    <ActionsItem
      className={cnSchemaActionsDelete()}
      title={disabled ? tooltipText || 'Удалить' : 'Удалить'}
      as={as}
      onClick={handleDelete}
      color='error'
      icon={state.dialogOpen ? <Delete /> : <DeleteOutline />}
      disabled={disabled}
    />
  );
});
