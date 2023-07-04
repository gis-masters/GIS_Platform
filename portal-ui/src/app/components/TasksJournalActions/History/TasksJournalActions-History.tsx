import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ArchiveOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { TaskJournalHistoryDialog } from '../../TaskJournalHistoryDialog/TaskJournalHistoryDialog';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Task } from '../../../services/data/task/task.models';

const cnTasksJournalActionsHistory = cn('TasksJournalActions', 'History');

interface TasksJournalActionsHistoryProps {
  task: Task;
  as: ActionsItemVariant;
}

@observer
export class TasksJournalActionsHistory extends Component<TasksJournalActionsHistoryProps> {
  @observable private dialogOpen = false;

  constructor(props: TasksJournalActionsHistoryProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, task } = this.props;

    return (
      <>
        <ActionsItem
          className={cnTasksJournalActionsHistory()}
          title='История'
          as={as}
          icon={<ArchiveOutlined />}
          onClick={this.openDialog}
        />

        <TaskJournalHistoryDialog task={task} closeDialog={this.closeDialog} dialogOpen={this.dialogOpen} />
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
