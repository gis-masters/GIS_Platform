import React, { Component } from 'react';
import { Map, MapOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Badge, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';

import { ConnectionsToProjectsWidget } from '../../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';
import { communicationService } from '../../../services/communication.service';
import { FileInfo, getFileConnections } from '../../../services/files.service';
import { CrgProject } from '../../../services/crg/projects.models';
import { IconButton } from '../../IconButton/IconButton';

const cnConnections = cn('Connections');

interface ConnectionsProps {
  fileId: string;
}

@observer
export class FilesConnections extends Component<ConnectionsProps> {
  private currentFileId: string;

  @observable private dialogOpen = false;
  @observable private connectionsNumber: number;
  @observable private connections?: CrgProject[] = [];
  @observable private loading = true;

  async componentDidMount() {
    await this.fetchConnections();

    communicationService.updateFileConnections.on(async (filesInfo: FileInfo[]) => {
      if (filesInfo.some(file => file.id === this.currentFileId)) {
        this.dropConnections();
        await this.fetchConnections();
      }
    });
  }

  async componentDidUpdate(prevProps: ConnectionsProps) {
    if (this.props.fileId !== prevProps.fileId) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    return (
      <>
        {this.connectionsNumber && (
          <Tooltip title='Подключено в проекты'>
            <IconButton className={cnConnections()} onClick={this.openDialog} size='small'>
              <Badge
                badgeContent={this.connectionsNumber}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                color='default'
              >
                {this.dialogOpen ? <Map fontSize='small' /> : <MapOutlined fontSize='small' />}
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        <ConnectionsToProjectsWidget
          onConnect={this.connectHandler}
          connectedProjects={this.connections}
          loading={this.loading}
          dialogOpen={this.dialogOpen}
          closeDialog={this.closeDialog}
          dialogsOnly
        />
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

  @action.bound
  private setConnectionsNumber(connectionsNumber: number) {
    this.connectionsNumber = connectionsNumber;
  }

  private async fetchConnections() {
    const { fileId } = this.props;
    this.setLoading(true);
    this.currentFileId = fileId;
    const documentConnections = await getFileConnections(fileId);

    if (documentConnections.length && this.currentFileId === fileId) {
      this.setConnections(documentConnections.map(({ project }) => project));
    }

    this.setLoading(false);
  }

  @action
  private setConnections(connections: CrgProject[]) {
    this.connections = connections;
    this.setConnectionsNumber(connections.length);
  }

  @action
  private dropConnections() {
    this.connections = null;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async connectHandler() {
    await this.fetchConnections();
  }
}
