import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { RestoreOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../../services/data/schema/schema.models';
import { Task } from '../../../services/data/task/task.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { TaskJournalHistoryDialog } from '../../TaskJournalHistoryDialog/TaskJournalHistoryDialog';

const cnTasksJournalActionsHistory = cn('TasksJournalActions', 'History');

interface TasksJournalActionsHistoryProps {
  task: Task;
  schema: Schema;
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
    const { as, task, schema } = this.props;

    return (
      <>
        <ActionsItem
          className={cnTasksJournalActionsHistory()}
          title='История'
          as={as}
          icon={<RestoreOutlined />}
          onClick={this.openDialog}
        />

        <TaskJournalHistoryDialog schema={schema} task={task} onClose={this.closeDialog} dialogOpen={this.dialogOpen} />
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
