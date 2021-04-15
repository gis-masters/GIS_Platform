import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { createLayer } from '../../services/geoserver/layers.service';
import { DataSet, DataTable, getDataTableConnections } from '../../services/data.service';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';
import { ExplorerProps } from '../Explorer/Explorer';
import { CrgLayerType, CrgProject } from '../../services/crg/projects.models';

const cnConnectionsTableToProjectsWidget = cn('ConnectionsTableToProjectsWidget');

interface ConnectionsTableToProjectsWidgetProps {
  dataTable: DataTable;
  dataSet: DataSet;
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
    const { dataTable, dataSet } = this.props;
    await this.createLayer(dataTable, dataSet, project);
    await this.fetchConnections();
  }

  async createLayer(table: DataTable, dataSet: DataSet, project: CrgProject) {
    const dataStoreName = `scratch_database_${currentUser.orgId}`;
    const newLayer = {
      dataStoreName,
      dataset: dataSet.identifier,
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
