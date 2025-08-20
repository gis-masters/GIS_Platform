import React from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Task } from '../../../services/data/task/task.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { TaskDialog } from '../../TaskDialog/TaskDialog';

const cnTasksJournalActionsOpen = cn('TasksJournalActions', 'Open');

interface TasksJournalActionsOpenProps {
  task: Task;
  as: ActionsItemVariant;
}

interface DialogState {
  dialogOpen: boolean;
  openDialog(): void;
  closeDialog(): void;
}

export const TasksJournalActionsOpen = observer(({ task, as }: TasksJournalActionsOpenProps) => {
  const state = useLocalObservable<DialogState>(() => ({
    dialogOpen: false,
    openDialog() {
      this.dialogOpen = true;
    },
    closeDialog() {
      this.dialogOpen = false;
    }
  }));

  return (
    <>
      <ActionsItem
        className={cnTasksJournalActionsOpen()}
        title='Открыть'
        as={as}
        url={`/data-management/tasks-journal/${task.id}`}
        icon={<FileOpenOutlined />}
        onClick={state.openDialog}
      />

      <TaskDialog task={task} open={state.dialogOpen} onClose={state.closeDialog} />
    </>
  );
});
