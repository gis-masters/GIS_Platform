import React, { FC } from 'react';
import { Circle } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { TaskStatus } from '../../services/data/task/task.models';

import '!style-loader!css-loader!sass-loader!./TaskStatusIcon.scss';

const cnTaskStatusIcon = cn('TaskStatusIcon');

enum StatusColor {
  CREATED = 'disabled',
  DONE = 'success',
  CANCELED = 'error',
  IN_PROGRESS = 'primary'
}

interface TaskStatusIconProps {
  status?: TaskStatus;
}

export const TaskStatusIcon: FC<TaskStatusIconProps> = ({ status }) => (
  <Circle className={cnTaskStatusIcon()} color={status ? StatusColor[status] : 'disabled'} fontSize='small' />
);
