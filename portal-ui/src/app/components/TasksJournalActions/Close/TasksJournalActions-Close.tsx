import React, { FC } from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnTasksJournalActionsClose = cn('TasksJournalActions', 'Close');

interface TasksJournalActionsCloseProps {
  onClick?(): void;
  as: ActionsItemVariant;
}

export const TasksJournalActionsClose: FC<TasksJournalActionsCloseProps> = ({ onClick, as }) => (
  <ActionsItem className={cnTasksJournalActionsClose()} title='Закрыть' icon={<Close />} onClick={onClick} as={as} />
);
