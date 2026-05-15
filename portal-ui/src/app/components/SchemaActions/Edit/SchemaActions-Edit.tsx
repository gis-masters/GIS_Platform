import React, { useCallback, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Edit, EditOutlined, Schema as SchemaIcon, SchemaOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type Library } from '../../../services/data/library/library.models';
import { type Schema } from '../../../services/data/schema/schema.models';
import { DataEntityType, type VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { type ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { SchemaEditDialog } from '../../SchemaEditDialog/SchemaEditDialog';

const cnSchemaActionsEdit = cn('SchemaActions', 'Edit');

interface SchemaActionsEditProps {
  schema: Schema;
  as: ActionsItemVariant;
  item?: Library | VectorTable;
  withPreview?: boolean;
  readonly?: boolean;
  editing?: boolean;
  disabled?: boolean;
  tooltipText?: string;
}

interface SchemaActionsEditState {
  dialogOpen: boolean;

  setDialogOpen(dialogOpen: boolean): void;
}

export const SchemaActionsEdit = observer((props: SchemaActionsEditProps) => {
  const {
    schema: propSchema,
    as,
    item: explorerItem,
    withPreview,
    readonly = false,
    editing,
    disabled,
    tooltipText
  } = props;

  const state = useLocalObservable<SchemaActionsEditState>(() => ({
    dialogOpen: false,

    setDialogOpen(dialogOpen) {
      this.dialogOpen = dialogOpen;
    }
  }));

  const icons = [
    [SchemaOutlined, SchemaIcon],
    [EditOutlined, Edit]
  ];

  const Icon = icons[Number(!!editing)][Number(state.dialogOpen)];

  const buttonTitle = useMemo(() => {
    if (editing) {
      return 'Редактировать';
    }

    return readonly ? 'Просмотр схемы' : 'Редактировать схему';
  }, [editing, readonly]);

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

  const openDialog = useCallback(() => {
    state.setDialogOpen(true);
  }, [state]);

  const closeDialog = useCallback(() => {
    state.setDialogOpen(false);
  }, [state]);

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

      <SchemaEditDialog
        title={schemaEditTitle}
        open={state.dialogOpen}
        onClose={closeDialog}
        schema={propSchema}
        explorerItem={explorerItem}
        readonly={readonly}
        editing={editing}
        withPreview={withPreview}
      />
    </>
  );
});
