import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from '@mui/material';
import { ArchiveOutlined } from '@mui/icons-material';

import { Task, TaskHistory } from '../../services/data/task/task.models';
import { getTaskHistory } from '../../services/data/task/task.service';
import { TaskHistoryItem } from '../TaskHistoryItem/TaskHistoryItem';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./TaskJournalHistoryDialog.scss';

const cnTaskJournalHistoryDialog = cn('TaskJournalHistoryDialog');
const cnTaskJournalHistoryDialogContent = cn('TaskJournalHistoryDialog', 'Content');

interface TaskJournalHistoryDialogProps {
  closeDialog: () => void;
  dialogOpen: boolean;
  task: Task;
}

@observer
export class TaskJournalHistoryDialog extends Component<TaskJournalHistoryDialogProps> {
  @observable private loading = false;
  @observable private taskHistory: TaskHistory[] = [];

  constructor(props: TaskJournalHistoryDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidUpdate(prevProps: TaskJournalHistoryDialogProps): Promise<void> {
    if (this.props.dialogOpen && !prevProps.dialogOpen) {
      await this.getTaskHistory();
    }
  }

  render() {
    const { dialogOpen, closeDialog } = this.props;

    return (
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth='xl'>
        <DialogTitle>
          <div className={cnTaskJournalHistoryDialog('TypeIcon')}>
            <ArchiveOutlined color='primary' />
          </div>
          История изменений задачи
        </DialogTitle>

        <DialogContent className={cnTaskJournalHistoryDialogContent(null, ['scroll'])}>
          {this.loading ? (
            <Skeleton height={20} animation='wave' width={String(40 + Math.random() * 60) + '%'} />
          ) : (
            this.taskHistory?.map(taskHistory => <TaskHistoryItem key={taskHistory.id} taskHistory={taskHistory} />)
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private async getTaskHistory() {
    this.setLoading(true);

    if (this.props.task.id) {
      try {
        const taskHistory = await getTaskHistory(this.props.task.id);
        this.setTaskHistory(taskHistory);
      } catch {
        Toast.error('Ошибка получения истории задачи');
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

  @action
  private setTaskHistory(taskHistory: TaskHistory[]) {
    this.taskHistory = taskHistory;
  }
}
