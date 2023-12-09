import React, { FC } from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnSchemaActionsClose = cn('SchemaActions', 'Close');

interface SchemaActionsCloseProps {
  onClick?(): void;
  as: ActionsItemVariant;
}

export const SchemaActionsClose: FC<SchemaActionsCloseProps> = ({ onClick, as }) => (
  <ActionsItem className={cnSchemaActionsClose()} title='Закрыть' icon={<Close />} onClick={onClick} as={as} />
);
