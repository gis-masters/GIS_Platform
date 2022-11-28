import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../stores/CurrentProject.store';
import { VectorTableConnection, getVectorTableConnections } from '../../services/data/data.service';
import { getFeaturesUrlFragment } from '../../services/map/map-url.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgProject } from '../../services/gis/projects.models';
import { SelectProjectsDialog } from '../SelectProjectDialog/SelectProjectDialog';

const cnOpenInAnotherProject = cn('OpenInAnotherProject');

interface OpenInAnotherProjectProps {
  feature: WfsFeature;
}

@observer
export class OpenInAnotherProject extends Component<OpenInAnotherProjectProps> {
  @observable private dialogOpen = false;
  @observable private connections: VectorTableConnection[] = [];
  private connectionsFetchingOperationId: symbol;

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
    const connections = await getVectorTableConnections(feature.id.split('.')[0]);
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

    location.href = `${location.origin}/projects/${project.id}/map?features=${getFeaturesUrlFragment([feature])}`;
  }
}
