import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Schema } from '../../services/data/schema/schema.models';
import { Task } from '../../services/data/task/task.models';
import { Actions } from '../Actions/Actions.composed';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { TasksJournalActionsClose } from './Close/TasksJournalActions-Close';
import { TasksJournalActionsEdit } from './Edit/TasksJournalActions-Edit';
import { TasksJournalActionsHistory } from './History/TasksJournalActions-History';
import { TasksJournalActionsOpen } from './Open/TasksJournalActions-Open';
import { TasksJournalActionsShare } from './Share/TasksJournalActions-Share';

export const cnLibraryTaskActions = cn('LibraryTaskActions');

export interface TasksJournalActionsProps extends IClassNameProps {
  task: Task;
  schema: Schema;
  primalSchema?: Schema;
  forDialog?: boolean;
  hideOpen?: boolean;
  as: ActionsItemVariant;
  onDialogClose?(): void;
}

@observer
export default class TasksJournalActions extends Component<TasksJournalActionsProps> {
  constructor(props: TasksJournalActionsProps) {
    super(props);
  }

  render() {
    const { as, className, task, schema, primalSchema, hideOpen, forDialog, onDialogClose } = this.props;

    return (
      <Actions className={cnLibraryTaskActions(null, [className])} as={as}>
        {!hideOpen && <TasksJournalActionsOpen task={task} as={as} />}
        <TasksJournalActionsShare task={task} as={as} />
        {primalSchema && <TasksJournalActionsEdit primalSchema={primalSchema} task={task} as={as} />}
        <TasksJournalActionsHistory schema={schema} task={task} as={as} />
        {forDialog && <TasksJournalActionsClose onClick={onDialogClose} as={as} />}
      </Actions>
    );
  }
}
