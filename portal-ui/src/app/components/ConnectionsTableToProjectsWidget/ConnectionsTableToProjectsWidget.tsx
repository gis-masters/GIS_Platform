import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { VectorTable, getVectorTableConnections } from '../../services/data/data.service';
import { CrgProject } from '../../services/gis/projects.models';
import { vectorLayerDefaults } from '../../services/gis/layers.utils';
import { FileConnection } from '../../services/data/files.service';
import { schemaService } from '../../services/data/schema.service';
import { createLayer } from '../../services/gis/layers.service';
import { Schema } from '../../services/data/schema.models';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';

const cnConnectionsTableToProjectsWidget = cn('ConnectionsTableToProjectsWidget');

interface ConnectionsTableToProjectsWidgetProps {
  vectorTable: VectorTable;
}

@observer
export class ConnectionsTableToProjectsWidget extends Component<ConnectionsTableToProjectsWidgetProps> {
  private currentVectorTableId = '';

  @observable private selectContentTypeDialogOpen = false;
  @observable private schema?: Schema;
  @observable private connections?: FileConnection[] = [];
  @observable private loading = true;
  @observable private project: CrgProject;

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
    return (
      <ConnectionsToProjectsWidget
        className={cnConnectionsTableToProjectsWidget()}
        onConnect={this.save}
        connections={this.connections}
        loading={this.loading}
        schema={this.schema}
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

    const schema = await schemaService.getSchema(vectorTable?.schemaId);
    this.setSchema(schema);

    this.setLoading(false);
  }

  @action
  private setConnections(connections: FileConnection[]) {
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
  private async save(project: CrgProject, view: string) {
    const { vectorTable } = this.props;
    await this.createLayer(vectorTable, vectorTable.dataset, project, view);
    await this.fetchConnections();
  }

  private async createLayer(table: VectorTable, dataset: string, project: CrgProject, view: string) {
    const newStyleName = this.schema.views?.find(({ id }) => id === view)?.styleName;

    const newLayer = {
      ...vectorLayerDefaults(),
      dataset: dataset,
      tableName: table.identifier,
      complexName: `${currentUser.workspaceName}:${table.identifier}`,
      title: table.title,
      nativeCRS: table.crs,
      schemaId: table.schemaId,
      view,
      styleName: newStyleName || this.schema.styleName || table.schemaId
    };

    await createLayer(newLayer, project.id);
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }
}
