import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { CreateOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Task, taskSchema } from '../../../services/data/task/task.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { updateTask } from '../../../services/data/task/task.service';
import { FormDialog } from '../../FormDialog/FormDialog';
import { getPatch } from '../../../services/util/patch';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';

const cnTasksJournalActionsEdit = cn('TasksJournalActions', 'Edit');

interface TasksJournalActionsEditProps {
  task: Task;
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
    const { as, task } = this.props;

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
          title='Редактирование задачи'
          actionFunction={this.edit}
          onClose={this.closeDialog}
          value={task}
          open={this.openDialog}
          schema={taskSchema}
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
        Toast.error('Ошибка при редактировании задачи');
        services.logger.error(error);
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
