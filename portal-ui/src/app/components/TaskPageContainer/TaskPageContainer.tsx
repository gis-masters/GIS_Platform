import React, { useCallback, useEffect, useRef } from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { ArticleOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { Schema } from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { Task } from '../../services/data/task/task.models';
import { getTask, getTaskSchema } from '../../services/data/task/task.service';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { Link } from '../Link/Link';
import { Loading } from '../Loading/Loading';
import { TaskCard } from '../TaskCard/TaskCard';
import { TasksJournalActions } from '../TasksJournalActions/TasksJournalActions';
import { TextBadge } from '../TextBadge/TextBadge';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./TaskPageContainer.scss';

const cnTaskPageContainer = cn('TaskPageContainer');

interface TaskPageState {
  task?: Task;
  error?: string;
  primalSchema?: Schema;
  busy: boolean;
  setTask(task: Task): void;
  setError(error: string): void;
  setPrimalSchema(schema: Schema): void;
  setBusy(busy: boolean): void;
  get schema(): Schema | undefined;
}

export const TaskPageContainer = observer(() => {
  const state = useLocalObservable<TaskPageState>(() => ({
    task: undefined,
    error: undefined,
    primalSchema: undefined,
    busy: false,

    setTask(task: Task) {
      this.task = task;
    },
    setError(error: string) {
      this.error = error;
    },
    setPrimalSchema(schema: Schema) {
      this.primalSchema = schema;
    },
    setBusy(busy: boolean) {
      this.busy = busy;
    },
    get schema(): Schema | undefined {
      if (!this.task || !this.primalSchema) {
        return;
      }

      return applyContentType(this.primalSchema, this.task.content_type_id);
    }
  }));

  const operationIdRef = useRef<symbol>();

  const fetchSchema = async () => {
    try {
      const schema = await getTaskSchema();

      runInAction(() => {
        state.setPrimalSchema(schema);
      });
    } catch (error) {
      const err = error as AxiosError;
      Toast.error('Ошибка получения схемы задач');
      services.logger.error('Не удалось получить схему: ', err.message);
    }
  };

  const fetchTask = async () => {
    const taskId = Number(route.params.taskId);
    const operationId = Symbol();
    operationIdRef.current = operationId;

    try {
      const fetchedTask = await getTask(taskId);

      if (operationIdRef.current !== operationId) {
        return;
      }

      runInAction(() => {
        state.setTask(fetchedTask);
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      state.setBusy(false);

      const errorMessage = err?.response?.data?.message || err?.message || 'Не удалось открыть задачу';
      state.setError(errorMessage);
      services.logger.error('Не удалось открыть задачу: ', err.message);
    }
  };

  const init = useCallback(async () => {
    state.setBusy(true);
    await fetchSchema();
    await fetchTask();
    state.setBusy(false);
  }, []);

  useEffect(() => {
    void init();

    communicationService.taskUpdated.on(init);

    return () => {
      communicationService.taskUpdated.off(init);
    };
  }, [init]);

  return (
    <div className={cnTaskPageContainer()}>
      {!state.error && state.task && (
        <>
          <h1 className={cnTaskPageContainer('Title')}>
            <ArticleOutlined color='primary' className={cnTaskPageContainer('TypeIcon')} />
            Задача №{state.task.id}
            {state.task.id && <TextBadge id={state.task.id} className={cnTaskPageContainer('Id')} />}
          </h1>

          <TaskCard task={state.task} />

          {state.primalSchema && state.schema && (
            <TasksJournalActions
              className={cnTaskPageContainer('Actions')}
              primalSchema={state.primalSchema}
              schema={state.schema}
              task={state.task}
              as='button'
              hideOpen
            />
          )}
        </>
      )}

      {state.error && (
        <EmptyListView text={state.error}>
          <Link href={'/data-management/tasks-journal'}>На страницу журнала задач</Link>
        </EmptyListView>
      )}

      <Loading visible={state.busy} />
    </div>
  );
});
