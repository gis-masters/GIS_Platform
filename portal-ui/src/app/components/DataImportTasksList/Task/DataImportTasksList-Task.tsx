import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { deleteTask } from '../../../services/geoserver/import/import.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { currentImport, ImportTaskExtended } from '../../../stores/CurrentImport.store';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListTaskProps {
  task: ImportTaskExtended;
  short: boolean;
  onDeleteTask(): void;
}

@observer
export class DataImportTasksListTask extends Component<DataImportTasksListTaskProps> {
  @observable private isDeleting = false;

  constructor(props: DataImportTasksListTaskProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { short, task } = this.props;
    const { statusText, layer, state, isError } = task;
    const progress = state === 'RUNNING' && currentImport.progress;

    return (
      <>
        <tr className={cnDataImportTasksList('Task', { error: isError, deleting: this.isDeleting, short })}>
          <td className={cnDataImportTasksList('TaskName')}>{layer ? layer.name : ''}</td>
          <td className={cnDataImportTasksList('TaskStatus')}>{statusText}</td>
          {short ? null : (
            <>
              <td className={cnDataImportTasksList('TaskProgress')}>
                {progress ? progress.progress : '\u00A0'}
                {progress && progress.total ? ` / ${progress.total}` : ''}
              </td>
              <td className={cnDataImportTasksList('TaskControls')}>
                <Tooltip title='Удалить слой'>
                  <IconButton
                    className={cnDataImportTasksList('TaskDel')}
                    size='small'
                    disabled={this.isDeleting}
                    onClick={this.deleteTask}
                  >
                    <Delete fontSize='inherit' className={cnDataImportTasksList('TaskDelIcon')} />
                  </IconButton>
                </Tooltip>
              </td>
            </>
          )}
        </tr>
      </>
    );
  }

  @action.bound
  private async deleteTask() {
    const confirmed = await konfirmieren({
      message: 'Вы действительно хотите удалить слой?',
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      this.isDeleting = true;
      await deleteTask(this.props.task);
      this.props.onDeleteTask();
    }
  }
}
