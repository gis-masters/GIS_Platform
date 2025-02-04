import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { FileConnection } from '../../services/data/files/files.models';
import { VectorTable } from '../../services/data/vectorData/vectorData.models';
import { getVectorTableConnections } from '../../services/data/vectorData/vectorData.service';
import { buildComplexName } from '../../services/geoserver/featureType/featureType.util';
import { createLayer } from '../../services/gis/layers/layers.service';
import { vectorLayerDefaults } from '../../services/gis/layers/layers.utils';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';

const cnConnectionsTableToProjectsWidget = cn('ConnectionsTableToProjectsWidget');

interface ConnectionsTableToProjectsWidgetProps {
  vectorTable: VectorTable;
}

@observer
export class ConnectionsTableToProjectsWidget extends Component<ConnectionsTableToProjectsWidgetProps> {
  private currentVectorTableId = '';
  @observable private connections?: FileConnection[] = [];
  @observable private loading = true;

  constructor(props: ConnectionsTableToProjectsWidgetProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: ConnectionsTableToProjectsWidgetProps) {
    if (this.props.vectorTable.identifier !== prevProps.vectorTable.identifier) {
      this.dropConnections();
      await this.fetchConnections();
    }
  }

  render() {
    const { vectorTable } = this.props;

    return (
      <ConnectionsToProjectsWidget
        className={cnConnectionsTableToProjectsWidget()}
        onConnect={this.save}
        connections={this.connections}
        loading={this.loading}
        schema={vectorTable.schema}
        showAsExtendList
        dialogTitle='Проекты, в которые подключен векторный слой'
      />
    );
  }

  private async fetchConnections() {
    const { vectorTable } = this.props;
    this.setLoading(true);
    this.currentVectorTableId = vectorTable.identifier;
    const vectorTableConnections = await getVectorTableConnections(vectorTable.identifier);
    if (vectorTableConnections.length && this.currentVectorTableId === vectorTable.identifier) {
      this.setConnections(vectorTableConnections);
    }

    this.setLoading(false);
  }

  @action
  private setConnections(connections: FileConnection[]) {
    this.connections = connections;
  }

  @action
  private dropConnections() {
    this.connections = undefined;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async save(project: CrgProject, view: string) {
    const { vectorTable } = this.props;
    await this.createLayer(vectorTable.dataset, project, view);
    await this.fetchConnections();
  }

  private async createLayer(dataset: string, project: CrgProject, view: string) {
    const { vectorTable } = this.props;
    const newStyleName = vectorTable.schema.views?.find(({ id }) => id === view)?.styleName;

    const newLayer = {
      ...vectorLayerDefaults(),
      dataset: dataset,
      tableName: vectorTable.identifier,
      complexName: buildComplexName(currentUser.workspaceName, vectorTable.identifier, vectorTable.crs),
      title: vectorTable.title,
      nativeCRS: vectorTable.crs,
      schemaId: vectorTable.schema.name,
      view,
      styleName: newStyleName || vectorTable.schema.styleName || vectorTable.schema.name
    };

    await createLayer(newLayer, project.id);
  }
}
