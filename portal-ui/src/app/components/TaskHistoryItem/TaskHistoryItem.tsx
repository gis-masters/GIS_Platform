import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { TaskHistory, taskSchema } from '../../services/data/task/task.models';
import { formatDate } from '../../services/util/date.util';
import Form from '../Form/Form.async';

import '!style-loader!css-loader!sass-loader!./TaskHistoryItem.scss';

const cnTaskHistoryItem = cn('TaskHistoryItem');

interface TaskHistoryItemProps extends IClassNameProps {
  taskHistory: TaskHistory;
}

export const TaskHistoryItem: FC<TaskHistoryItemProps> = ({ taskHistory: taskHistory }) => (
  <Accordion className={cnTaskHistoryItem()}>
    <AccordionSummary expandIcon={<ExpandMore />} id={String(taskHistory.id)} aria-controls={String(taskHistory.id)}>
      {taskHistory.eventType} {formatDate(taskHistory.createdAt, 'DD.MM.YYYY HH:mm:ss')}
    </AccordionSummary>

    <AccordionDetails>
      <Form id={String(taskHistory.id)} schema={taskSchema} value={taskHistory.massage} auto readonly />
    </AccordionDetails>
  </Accordion>
);
