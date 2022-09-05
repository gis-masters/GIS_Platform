import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { Map, MapOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FileConnection, FileInfo } from '../../../services/data/files.service';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { IconButton } from '../../IconButton/IconButton';
import { Button } from '../../Button/Button';

const cnFilesConnections = cn('Files', 'Connections');

interface ConnectionsProps {
  file: FileInfo;
  connections: FileConnection[];
}

@observer
export class FilesConnections extends Component<ConnectionsProps> {
  @observable private dialogOpen = false;

  constructor(props: ConnectionsProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { connections, file } = this.props;

    return (
      <>
        <Tooltip title='Подключено в проекты'>
          <IconButton className={cnFilesConnections()} onClick={this.openDialog} size='small'>
            <Badge
              badgeContent={connections.length}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              color='default'
            >
              {this.dialogOpen ? <Map fontSize='small' /> : <MapOutlined fontSize='small' />}
            </Badge>
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Проекты, в которые подключен файл: {file.title}</DialogTitle>
          <DialogContent className='scroll'>
            <ConnectionsToProjects type='list' connections={connections} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
