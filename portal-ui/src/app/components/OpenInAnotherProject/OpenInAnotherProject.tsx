import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { VectorTableConnection } from '../../services/data/vectorData/vectorData.models';
import { getVectorTableConnections } from '../../services/data/vectorData/vectorData.service';
import { extractTableNameFromFeatureId } from '../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { getFeaturesUrl } from '../../services/map/map.util';
import { currentProject } from '../../stores/CurrentProject.store';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';

const cnOpenInAnotherProject = cn('OpenInAnotherProject');

interface OpenInAnotherProjectProps {
  feature: WfsFeature;
}

@observer
export class OpenInAnotherProject extends Component<OpenInAnotherProjectProps> {
  @observable private dialogOpen = false;
  @observable private connections: VectorTableConnection[] = [];
  private connectionsFetchingOperationId?: symbol;

  constructor(props: OpenInAnotherProjectProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchConnections();
  }

  async componentDidUpdate(prevProps: OpenInAnotherProjectProps) {
    if (prevProps.feature.id !== this.props.feature.id) {
      this.setConnections([]);
      await this.fetchConnections();
    }
  }

  render() {
    return (
      <>
        <Tooltip title='Открыть этот объект в другом проекте'>
          <span className={cnOpenInAnotherProject()}>
            <IconButton onClick={this.openDialog} disabled={!this.projects.length}>
              <Badge
                badgeContent={this.projects.length}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                color='default'
              >
                <OpenInNew />
              </Badge>
            </IconButton>
          </span>
        </Tooltip>

        <SelectProjectsDialog
          projects={this.projects}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          actionButtonLabel='Открыть'
        />
      </>
    );
  }

  private async fetchConnections() {
    const { feature } = this.props;
    const operationId = Symbol();
    this.connectionsFetchingOperationId = operationId;
    const connections = await getVectorTableConnections(extractTableNameFromFeatureId(feature.id));
    if (this.connectionsFetchingOperationId === operationId) {
      this.setConnections(connections);
    }
  }

  @computed
  private get projects(): CrgProject[] {
    return this.connections
      .filter(({ project }) => project.id !== currentProject.id && project.role)
      .map(({ project }) => project);
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
  private select([project]: CrgProject[]) {
    this.closeDialog();
    this.navigateToObject(project);
  }

  @action
  private setConnections(connections: VectorTableConnection[]) {
    this.connections = connections;
  }

  private navigateToObject(project: CrgProject) {
    const { feature } = this.props;

    const layer = getLayerByFeatureInCurrentProject(feature);
    if (!layer) {
      throw new Error('Не удалось перейти к объекту, не найден слой: ' + feature.id);
    }

    location.href = getFeaturesUrl(project.id, layer.dataset, layer.tableName, [feature.id]);
  }
}
