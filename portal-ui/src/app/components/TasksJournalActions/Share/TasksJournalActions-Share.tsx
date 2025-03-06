import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { ShareOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Task } from '../../../services/data/task/task.models';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Toast } from '../../Toast/Toast';

const cnTasksJournalActionsShare = cn('TasksJournalActions', 'Share');

interface TasksJournalActionsShareProps {
  task: Task;
  as: ActionsItemVariant;
}

export const TasksJournalActionsShare = observer(({ task, as }: TasksJournalActionsShareProps) => {
  const handleClick = useCallback(() => {
    copyToClipboard(`${location.protocol}//${location.host}/data-management/tasks-journal/${task.id}`);
    Toast.success('Сохранено в буфер обмена');
  }, [task.id]);

  return (
    <ActionsItem
      className={cnTasksJournalActionsShare()}
      title='Копировать ссылку'
      icon={<ShareOutlined />}
      onClick={handleClick}
      as={as}
    />
  );
});
