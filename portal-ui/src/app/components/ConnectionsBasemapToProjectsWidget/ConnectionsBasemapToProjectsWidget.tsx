import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Basemap } from '../../services/data/basemaps/basemaps.models';
import { FileConnection } from '../../services/data/files/files.models';
import {
  connectBasemapToProject,
  getBasemapConnections
} from '../../services/gis/project-basemaps/project-basemaps.service';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';

const cnConnectionsBasemapToProjectsWidget = cn('ConnectionsBasemapToProjectsWidget');

interface ConnectionsBasemapToProjectsWidgetProps {
  basemap: Basemap;
}

@observer
export class ConnectionsBasemapToProjectsWidget extends Component<ConnectionsBasemapToProjectsWidgetProps> {
  private currentBasemapId = -1;

  @observable private connections?: FileConnection[] = [];
  @observable private loading = true;

  constructor(props: ConnectionsBasemapToProjectsWidgetProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: ConnectionsBasemapToProjectsWidgetProps) {
    if (this.props.basemap.id !== prevProps.basemap.id) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    return (
      <ConnectionsToProjectsWidget
        className={cnConnectionsBasemapToProjectsWidget()}
        onConnect={this.handleConnect}
        connections={this.connections}
        loading={this.loading}
        dialogTitle='Проекты в которые подключена подложка'
      />
    );
  }

  private async fetchConnections() {
    const { basemap } = this.props;

    this.setLoading(true);
    this.currentBasemapId = basemap.id;
    const basemapsConnections = await getBasemapConnections(basemap);
    if (this.currentBasemapId === basemap.id) {
      this.setConnections(basemapsConnections);
    }
    this.setLoading(false);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async handleConnect(project: CrgProject) {
    const { basemap } = this.props;
    await connectBasemapToProject(project, basemap);
    await this.fetchConnections();
  }

  @action
  private setConnections(connections: CrgProject[]) {
    this.connections = connections.map(project => ({ project }));
  }

  @action
  private dropConnections() {
    this.connections = undefined;
  }
}
