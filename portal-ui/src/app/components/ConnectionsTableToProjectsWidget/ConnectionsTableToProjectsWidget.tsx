import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { createLayer } from '../../services/geoserver/layers.service';
import { Dataset, DataTable, getDataTableConnections } from '../../services/data.service';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';
import { ExplorerProps } from '../Explorer/Explorer';
import { CrgLayerType, CrgProject } from '../../services/crg/projects.models';

const cnConnectionsTableToProjectsWidget = cn('ConnectionsTableToProjectsWidget');

interface ConnectionsTableToProjectsWidgetProps {
  dataTable: DataTable;
  dataset: Dataset;
  Explorer: React.ComponentType<ExplorerProps>;
}

@observer
export class ConnectionsTableToProjectsWidget extends Component<ConnectionsTableToProjectsWidgetProps> {
  private currentDataTableId = '';

  @observable private connections?: CrgProject[] = [];
  @observable private loading = true;

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: ConnectionsTableToProjectsWidgetProps) {
    if (this.props.dataTable.identifier !== prevProps.dataTable.identifier) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    const { Explorer } = this.props;

    return (
      <ConnectionsToProjectsWidget
        className={cnConnectionsTableToProjectsWidget()}
        Explorer={Explorer}
        onConnect={this.connectHandler}
        connectedProjects={this.connections}
        loading={this.loading}
      />
    );
  }

  private async fetchConnections() {
    const { dataTable } = this.props;
    this.setLoading(true);
    this.currentDataTableId = dataTable.identifier;
    const dataTableConnections = await getDataTableConnections(dataTable.identifier);
    if (this.currentDataTableId === dataTable.identifier) {
      this.setConnections(dataTableConnections.map(({ project }) => project));
    }
    this.setLoading(false);
  }

  @action
  private setConnections(connections: CrgProject[]) {
    this.connections = connections;
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
  private async connectHandler(project: CrgProject) {
    const { dataTable, dataset } = this.props;
    await this.createLayer(dataTable, dataset, project);
    await this.fetchConnections();
  }

  private async createLayer(table: DataTable, dataset: Dataset, project: CrgProject) {
    const dataStoreName = `scratch_database_${currentUser.orgId}`;
    const newLayer = {
      dataStoreName,
      dataset: dataset.identifier,
      tableName: table.identifier,
      complexName: `${dataStoreName}:${table.identifier}`,
      title: table.title,
      enabled: true,
      nativeCRS: table.crs,
      schemaId: table.schemaId,
      position: -42,
      transparency: 70,
      styleName: table.schemaId,
      type: CrgLayerType.VECTOR
    };

    await createLayer(newLayer, project);
  }
}
