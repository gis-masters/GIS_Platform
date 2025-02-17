import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { CreateOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Schema } from '../../../services/data/schema/schema.models';
import { applyContentType } from '../../../services/data/schema/schema.utils';
import { Task } from '../../../services/data/task/task.models';
import { updateTask } from '../../../services/data/task/task.service';
import { getPatch } from '../../../services/util/patch';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';
import { Toast } from '../../Toast/Toast';

const cnTasksJournalActionsEdit = cn('TasksJournalActions', 'Edit');
const cnTasksJournalActionsEditDialog = cn('TasksJournalActions', 'EditDialog');

interface TasksJournalActionsEditProps {
  task: Task;
  primalSchema: Schema;
  as: ActionsItemVariant;
}

@observer
export class TasksJournalActionsEdit extends Component<TasksJournalActionsEditProps> {
  @observable private openDialog = false;
  @observable private loading = false;

  constructor(props: TasksJournalActionsEditProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, task, primalSchema } = this.props;

    return (
      <>
        <ActionsItem
          className={cnTasksJournalActionsEdit()}
          title='Редактировать'
          as={as}
          icon={<CreateOutlined />}
          onClick={this.dialogOpen}
        />

        <FormDialog<Task>
          className={cnTasksJournalActionsEditDialog()}
          title='Редактирование задачи'
          actionFunction={this.edit}
          onClose={this.closeDialog}
          value={task}
          open={this.openDialog}
          schema={applyContentType(primalSchema, task.content_type_id)}
          actionButtonProps={{ children: 'Сохранить', loading: this.loading }}
        />
      </>
    );
  }

  @boundMethod
  private async edit(formValue: Task) {
    this.setLoading(true);

    if (this.props.task.id) {
      try {
        await updateTask(this.props.task.id, getPatch(formValue, this.props.task));
        this.closeDialog();
      } catch (error) {
        this.setLoading(false);

        throw error;
      }
    } else {
      Toast.error('Ошибка получения идентификатора задачи');
    }

    this.setLoading(false);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  private dialogOpen() {
    this.openDialog = true;
  }

  @action.bound
  private closeDialog() {
    this.openDialog = false;
  }
}
