import React, { Component } from 'react';
import { makeObservable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { ArchiveOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { Task, TaskHistory } from '../../services/data/task/task.models';
import { Schema } from '../../services/data/schema/schema.models';
import { Explorer } from '../Explorer/Explorer';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./TaskJournalHistoryDialog.scss';

const cnTaskJournalHistoryDialog = cn('TaskJournalHistoryDialog');
const cnTaskJournalHistoryDialogContent = cn('TaskJournalHistoryDialog', 'Content');

interface TaskJournalHistoryDialogProps {
  closeDialog: () => void;
  dialogOpen: boolean;
  task: Task;
  schema: Schema;
}

@observer
export class TaskJournalHistoryDialog extends Component<TaskJournalHistoryDialogProps> {
  constructor(props: TaskJournalHistoryDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { dialogOpen, closeDialog } = this.props;

    return (
      <Dialog className={cnTaskJournalHistoryDialog()} open={dialogOpen} onClose={closeDialog} fullWidth maxWidth='xl'>
        <DialogTitle>
          <div className={cnTaskJournalHistoryDialog('TypeIcon')}>
            <ArchiveOutlined color='primary' />
          </div>
          История изменений задачи
        </DialogTitle>

        <DialogContent className={cnTaskJournalHistoryDialogContent(null, ['scroll'])}>
          <Explorer
            className={cnTaskJournalHistoryDialog('Explorer')}
            explorerRole='taskJournalHistory'
            path={this.path}
            withInfoPanel
            withoutTitle
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return [{ type: ExplorerItemType.TASK_HISTORY_ROOT, payload: this.props.task as unknown as TaskHistory }];
  }
}
