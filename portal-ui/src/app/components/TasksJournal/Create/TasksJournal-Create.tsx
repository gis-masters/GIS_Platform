import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { PlaylistAdd, PlaylistAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { Task, taskSchema } from '../../../services/data/task/task.models';
import { createTask } from '../../../services/data/task/task.service';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnTasksJournalCreate = cn('TasksJournal', 'Create');

@observer
export class TasksJournalCreate extends Component {
  @observable private dialogOpen = false;
  @observable private loading = false;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать задачу'>
          <IconButton className={cnTasksJournalCreate()} onClick={this.openDialog}>
            {this.dialogOpen ? <PlaylistAdd /> : <PlaylistAddOutlined />}
          </IconButton>
        </Tooltip>

        <FormDialog<Task>
          title='Создание новой задачи'
          actionFunction={this.create}
          onClose={this.closeDialog}
          open={this.dialogOpen}
          schema={taskSchema}
          actionButtonProps={{ children: 'Создать', loading: this.loading }}
        />
      </>
    );
  }

  @boundMethod
  private async create(formValue: Task) {
    this.setLoading(true);

    await createTask(formValue);
    this.closeDialog();

    this.setLoading(false);
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
