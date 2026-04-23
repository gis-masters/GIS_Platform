import React, { useEffect, useMemo, useRef, useState } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';
import { type AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { type Schema } from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { type Task } from '../../services/data/task/task.models';
import { getTask, getTaskSchema } from '../../services/data/task/task.service';
import { type CommonDiRegistry } from '../../services/di-registry';
import { services } from '../../services/services';
import { TaskCard } from '../TaskCard/TaskCard';
import { TextBadge } from '../TextBadge/TextBadge';
import { Toast } from '../Toast/Toast';

import './TaskDialog.scss';

const cnTaskDialog = cn('TaskDialog');

interface TaskDialogProps {
  task: Task;
  open: boolean;
  onClose(): void;
}

export const TaskDialog = observer(({ task: initialTask, open, onClose }: TaskDialogProps) => {
  const [currentTask, setCurrentTask] = useState<Task>(initialTask);
  const [primalSchema, setPrimalSchema] = useState<Schema>();
  const operationIdRef = useRef<symbol>();

  const schema = useMemo(() => {
    if (currentTask && primalSchema) {
      return applyContentType(primalSchema, currentTask.content_type_id);
    }
  }, [currentTask, primalSchema]);

  const fetchSchema = async () => {
    try {
      const schema = await getTaskSchema();

      runInAction(() => {
        setPrimalSchema(schema);
      });
    } catch (error) {
      Toast.error('Ошибка получения схемы задач');
      services.logger.error('Ошибка получения схемы задач: ', (error as AxiosError).message);
    }
  };

  useEffect(() => {
    setCurrentTask(initialTask);
  }, [initialTask]);

  useEffect(() => {
    const fetchData = async () => {
      const operationId = Symbol();
      operationIdRef.current = operationId;

      try {
        const fetchedTask = await getTask(initialTask.id);

        if (operationIdRef.current === operationId) {
          runInAction(() => {
            setCurrentTask(fetchedTask);
          });
        }
      } catch (error) {
        Toast.error('Не удалось получить задачу');
        services.logger.error('Не удалось удалить задачу: ', (error as AxiosError).message);
      }
    };

    void fetchSchema();
    setCurrentTask(initialTask);

    communicationService.taskUpdated.on(async () => {
      await fetchData();
    });

    return () => {
      communicationService.taskUpdated.off(async () => {
        await fetchData();
      });
    };
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md' slotProps={{ paper: { className: cnTaskDialog() } }}>
      <DialogTitle>
        <div className={cnTaskDialog('TypeIcon')}>
          <InsertDriveFileOutlined color='primary' />
        </div>
        Просмотр задачи
        {!!currentTask.id && <TextBadge id={currentTask.id} />}
      </DialogTitle>

      <DialogContent className='scroll'>
        <TaskCard task={currentTask} className={cnTaskDialog('TaskCard')} />
      </DialogContent>

      {primalSchema && schema && (
        <DialogActions>
          <RegistryConsumer id='common'>
            {({ TasksJournalActions }: CommonDiRegistry) => (
              <TasksJournalActions
                primalSchema={primalSchema}
                schema={schema}
                task={currentTask}
                as='iconButton'
                forDialog
                onDialogClose={onClose}
              />
            )}
          </RegistryConsumer>
        </DialogActions>
      )}
    </Dialog>
  );
});
