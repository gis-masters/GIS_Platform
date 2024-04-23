import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem } from '@mui/material';
import { PlaylistAdd } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { usersService } from '../../../services/auth/users/users.service';
import { ContentType, Schema } from '../../../services/data/schema/schema.models';
import { applyContentType } from '../../../services/data/schema/schema.utils';
import { Task } from '../../../services/data/task/task.models';
import { createTask } from '../../../services/data/task/task.service';
import { FormDialog } from '../../FormDialog/FormDialog';

const cnTasksJournalCreate = cn('TasksJournal', 'Create');
const cnTasksJournalCreateDialog = cn('TasksJournal', 'CreateDialog');

export interface TasksJournalCreateProps {
  schema: Schema;
  contentType: ContentType;
}

@observer
export class TasksJournalCreate extends Component<TasksJournalCreateProps> {
  @observable private dialogOpen = false;

  constructor(props: TasksJournalCreateProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { contentType } = this.props;

    return (
      <>
        <MenuItem onClick={this.openDialog} className={cnTasksJournalCreate()}>
          <ListItemIcon>
            <PlaylistAdd />
          </ListItemIcon>
          {contentType.title}
        </MenuItem>

        <FormDialog<Task>
          className={cnTasksJournalCreateDialog()}
          title='Создание новой задачи'
          actionFunction={this.create}
          onClose={this.closeDialog}
          open={this.dialogOpen}
          value={{ content_type_id: contentType.id }}
          schema={this.preparedSchema}
          actionButtonProps={{ children: 'Создать' }}
        />
      </>
    );
  }

  @computed
  private get preparedSchema(): Schema {
    const { contentType, schema } = this.props;

    return applyContentType(schema, contentType.id);
  }

  @boundMethod
  private async create(formValue: Task) {
    if (formValue.assigned_to) {
      const user = await usersService.getUser(formValue.assigned_to);

      if (user.bossId) {
        formValue.owner_id = user.bossId;
      } else {
        throw new Error('У данного исполнителя не указан начальник');
      }
    }

    await createTask(formValue);
    this.closeDialog();
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
