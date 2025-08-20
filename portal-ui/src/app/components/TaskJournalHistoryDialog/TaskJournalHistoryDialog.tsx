import React, { Component } from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { RestoreOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { Task } from '../../services/data/task/task.models';
import { Button } from '../Button/Button';
import { Explorer } from '../Explorer/Explorer';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./TaskJournalHistoryDialog.scss';

const cnTaskJournalHistoryDialog = cn('TaskJournalHistoryDialog');
const cnTaskJournalHistoryDialogContent = cn('TaskJournalHistoryDialog', 'Content');

interface TaskJournalHistoryDialogProps {
  dialogOpen: boolean;
  task: Task;
  schema: Schema;
  onClose(): void;
}

@observer
export class TaskJournalHistoryDialog extends Component<TaskJournalHistoryDialogProps> {
  constructor(props: TaskJournalHistoryDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { dialogOpen, onClose } = this.props;

    return (
      <Dialog className={cnTaskJournalHistoryDialog()} open={dialogOpen} onClose={onClose} fullWidth maxWidth='xl'>
        <DialogTitle>
          <div className={cnTaskJournalHistoryDialog('TypeIcon')}>
            <RestoreOutlined color='primary' />
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
          <Button onClick={onClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @computed
  private get path(): ExplorerItemData[] | undefined {
    return [{ type: ExplorerItemType.TASK_HISTORY_ROOT, payload: this.props.task }];
  }
}
