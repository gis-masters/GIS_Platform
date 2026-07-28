import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type SchemaTemplate } from '../../services/data/schemaTemplate/schemaTemplate.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { Actions } from '../Actions/Actions.composed';
import { type ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { SchemaActionsClose } from './Close/SchemaActions-Close';
import { SchemaActionsDelete } from './Delete/SchemaActions-Delete';
import { SchemaActionsEdit } from './Edit/SchemaActions-Edit';
import { SchemaActionsPreview } from './Preview/SchemaActions-Preview';
import { SchemaActionsViewJson } from './ViewJson/SchemaActions-ViewJson';

export const cnSchemaActions = cn('SchemaActions');

export interface SchemaActionsProps extends IClassNameProps {
  schemaTemplate: SchemaTemplate;
  as: ActionsItemVariant;
  readonly?: boolean;
  forDialog?: boolean;
  onClose?(): void;
}

const SchemaActions: FC<SchemaActionsProps> = observer(
  ({ as, schemaTemplate, className, forDialog, readonly, onClose }) => {
    const schema = schemaTemplate.classRule;
    const own = schemaTemplate.createdBy === currentUser.login;
    const canEdit = !schemaTemplate.system && (currentUser.isAdmin || own);

    const getTooltip = (action: 'Редактирование' | 'Удаление'): string | undefined => {
      if (schemaTemplate.system) {
        return `${action} системной схемы недоступно.`;
      }

      if (!currentUser.isAdmin && !own) {
        return `${action} схемы, созданной другим пользователем, недоступно.`;
      }

      return undefined;
    };

    const editTooltip = getTooltip('Редактирование');
    const deleteTooltip = getTooltip('Удаление');

    return (
      <Actions className={cnSchemaActions({ forDialog }, [className])} as={as}>
        {!readonly && (
          <SchemaActionsEdit editing schema={schema} as={as} disabled={!canEdit} tooltipText={editTooltip} />
        )}

        <SchemaActionsPreview schema={schema} as={as} />

        <SchemaActionsViewJson schema={schema} as={as} />

        {!readonly && <SchemaActionsDelete schema={schema} as={as} disabled={!canEdit} tooltipText={deleteTooltip} />}

        {forDialog && <SchemaActionsClose as={as} onClick={onClose} />}
      </Actions>
    );
  }
);

export default SchemaActions;
