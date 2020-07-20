import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { cn } from '@bem-react/classname';

import { deleteTask } from '../../../services/geoserver/import/import.service';
import { Button } from '../../Button/Button';
import { currentImport, ImportTaskExtended } from '../../../stores/CurrentImport.store';

const cnDataImportTasksList = cn('DataImportTasksList');

interface DataImportTasksListTaskProps {
  task: ImportTaskExtended;
  onDeleteTask: () => void;
  short: boolean;
}

@observer
export class DataImportTasksListTask extends Component<DataImportTasksListTaskProps> {
  @observable private isDelDialogOpen = false;
  @observable private isDeleting = false;

  render() {
    const { short, task } = this.props;
    const { statusText, layer, state, isError } = task;
    const progress = state === 'RUNNING' && currentImport.progress;

    return (
      <>
        <tr className={cnDataImportTasksList('Task', { error: isError, deleting: this.isDeleting, short })}>
          <td className={cnDataImportTasksList('TaskName')}>{layer ? layer.name : ''}</td>
          <td className={cnDataImportTasksList('TaskStatus')}>{statusText}</td>
          {!short ? (
            <>
              <td className={cnDataImportTasksList('TaskProgress')}>
                {progress ? progress.progress : '\u00A0'}
                {progress && progress.total ? ` / ${progress.total}` : ''}
              </td>
              <td className={cnDataImportTasksList('TaskControls')}>
                <Tooltip title='Удалить слой'>
                  <IconButton
                    aria-label='delete'
                    className={cnDataImportTasksList('TaskDel')}
                    size='small'
                    disabled={this.isDeleting}
                    onClick={this.openDeleteDialog}
                  >
                    <DeleteIcon fontSize='inherit' className={cnDataImportTasksList('TaskDelIcon')} />
                  </IconButton>
                </Tooltip>
              </td>
            </>
          ) : null}
        </tr>

        <Dialog open={this.isDelDialogOpen} onClose={this.closeDeleteDialog}>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить слой?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteTask} color='primary'>
              OK
            </Button>
            <Button onClick={this.closeDeleteDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private async deleteTask() {
    this.isDeleting = true;
    this.closeDeleteDialog();
    await deleteTask(this.props.task);
    this.props.onDeleteTask();
  }

  @action.bound
  private openDeleteDialog() {
    this.isDelDialogOpen = true;
  }

  @action.bound
  private closeDeleteDialog() {
    this.isDelDialogOpen = false;
  }
}
