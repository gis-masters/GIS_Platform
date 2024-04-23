import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CircularProgress, List, ListItemButton, ListItemText } from '@mui/material';
import { DoneOutlined, ErrorOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FilesPlacementReportStore } from '../FilesPlacementDialog/FilesPlacementDialog.store';

import '!style-loader!css-loader!sass-loader!./FilesPlacementDialogReport.scss';
import '!style-loader!css-loader!sass-loader!./List/FilesPlacementDialogReport-List.scss';

const cnFilesPlacementDialogReport = cn('FilesPlacementDialogReport');

export interface FilesPlacementDialogReportProps {
  store: FilesPlacementReportStore;
}

@observer
export default class FilesPlacementDialogReport extends Component<FilesPlacementDialogReportProps> {
  render() {
    const { store } = this.props;

    const tasks = store.tasks;

    return (
      <div className={cnFilesPlacementDialogReport()}>
        <List className={cnFilesPlacementDialogReport('List')} dense>
          {tasks.map(task => (
            <ListItemButton
              className={cnFilesPlacementDialogReport('ListItem')}
              key={task.id}
              selected={task.inProgress}
            >
              <ListItemText primary={task.title} secondary={task.description || null} />
              <>
                {task.status === 'PENDING' && <CircularProgress size={16} />}
                {task.status === 'DONE' && <DoneOutlined color='success' />}
                {task.status === 'ERROR' && <ErrorOutlined color='warning' />}
              </>
            </ListItemButton>
          ))}
        </List>
      </div>
    );
  }
}
