import React, { Component } from 'react';
import { Map, MapOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { Badge, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { FileConnection, FileInfo } from '../../../services/files.service';
import { IconButton } from '../../IconButton/IconButton';
import { Button } from '../../Button/Button';

const cnConnections = cn('Connections');

interface ConnectionsProps {
  file: FileInfo;
  connections: FileConnection[];
}

@observer
export class FilesConnections extends Component<ConnectionsProps> {
  @observable private dialogOpen = false;

  render() {
    const { connections, file } = this.props;

    return (
      <>
        <Tooltip title='Подключено в проекты'>
          <IconButton className={cnConnections()} onClick={this.openDialog} size='small'>
            <Badge
              badgeContent={connections.length}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
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
