import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FactCheckOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType } from '../../../services/data/schema/schema.models';
import { Task, TaskStatus } from '../../../services/data/task/task.models';
import { updateTaskStatus } from '../../../services/data/task/task.service';
import { services } from '../../../services/services';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FormDialog } from '../../FormDialog/FormDialog';
import { Toast } from '../../Toast/Toast';

const cnTasksJournalActionsStatus = cn('TasksJournalActions', 'Status');
const cnTasksJournalActionsStatusDialog = cn('TasksJournalActions', 'StatusDialog');

interface TasksJournalActionsStatusProps {
  task: Task;
  as: ActionsItemVariant;
}

@observer
export class TasksJournalActionsStatus extends Component<TasksJournalActionsStatusProps> {
  @observable private openDialog = false;
  @observable private loading = false;

  constructor(props: TasksJournalActionsStatusProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, task } = this.props;

    return (
      <>
        <ActionsItem
          className={cnTasksJournalActionsStatus()}
          title='Изменить статус'
          as={as}
          icon={<FactCheckOutlined />}
          onClick={this.dialogOpen}
        />

        <FormDialog<Task>
          className={cnTasksJournalActionsStatusDialog()}
          title='Изменение статуса задачи'
          actionFunction={this.edit}
          onClose={this.closeDialog}
          value={{ status: task?.status }}
          open={this.openDialog}
          schema={{
            name: 'status',
            title: 'Статус',
            properties: [
              {
                propertyType: PropertyType.CHOICE,
                name: 'status',
                title: 'Статус задачи',
                options: [
                  { title: 'Создана', value: TaskStatus.CREATED },
                  { title: 'Выполнена', value: TaskStatus.DONE },
                  { title: 'Отменена', value: TaskStatus.CANCELED },
                  { title: 'В работе', value: TaskStatus.IN_PROGRESS }
                ]
              }
            ]
          }}
          actionButtonProps={{ children: 'Сохранить', loading: this.loading }}
        />
      </>
    );
  }

  @boundMethod
  private async edit(formValue: Task) {
    this.setLoading(true);
    if (formValue.status === TaskStatus.CREATED) {
      this.setLoading(false);

      return;
    }

    if (this.props.task.id && formValue.status) {
      try {
        await updateTaskStatus(this.props.task.id, formValue.status);
        this.closeDialog();
      } catch (error) {
        Toast.error('Ошибка при изменении статуса задачи');
        services.logger.error(error);
      }
    } else {
      Toast.error('Ошибка получения идентификатора или статуса задачи');
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
