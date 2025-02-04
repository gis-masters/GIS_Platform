import React, { FC } from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentActionsClose = cn('LibraryDocumentActions', 'Close');

interface LibraryDocumentActionsCloseProps {
  onClick?(): void;
  as: ActionsItemVariant;
}

export const LibraryDocumentActionsClose: FC<LibraryDocumentActionsCloseProps> = ({ onClick, as }) => (
  <ActionsItem className={cnLibraryDocumentActionsClose()} title='Закрыть' icon={<Close />} onClick={onClick} as={as} />
);
