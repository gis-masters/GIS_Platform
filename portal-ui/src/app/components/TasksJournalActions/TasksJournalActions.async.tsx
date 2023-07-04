import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { Task } from '../../services/data/task/task.models';

import { TasksJournalActionsHistory } from './History/TasksJournalActions-History';
import { TasksJournalActionsStatus } from './Status/TasksJournalActions-Status';
import { TasksJournalActionsEdit } from './Edit/TasksJournalActions-Edit';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { Actions } from '../Actions/Actions.composed';

export const cnLibraryTaskActions = cn('LibraryTaskActions');

export interface TasksJournalActionsProps extends IClassNameProps {
  task: Task;
  as: ActionsItemVariant;
}

@observer
export default class TasksJournalActions extends Component<TasksJournalActionsProps> {
  constructor(props: TasksJournalActionsProps) {
    super(props);
  }

  render() {
    const { as, className, task } = this.props;

    return (
      <Actions className={cnLibraryTaskActions(null, [className])} as={as}>
        <TasksJournalActionsStatus task={task} as={as} />
        <TasksJournalActionsEdit task={task} as={as} />
        <TasksJournalActionsHistory task={task} as={as} />
      </Actions>
    );
  }
}
