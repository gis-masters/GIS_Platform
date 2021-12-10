import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../stores/CurrentProject.store';
import { DataTableConnection, getDataTableConnections } from '../../services/data.service';
import { MAP_QUERY_PARAMS_DELIMITER } from '../../services/map/map-link-following.service';
import { CrgLayer, CrgProject } from '../../services/crg/projects.models';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { SortParams } from '../../services/util/sortObjects';
import { services } from '../../services/services';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { XTableColumn } from '../XTable/XTable';

import '!style-loader!css-loader!sass-loader!./OpenInAnotherProject.scss';

const cnOpenInAnotherProject = cn('OpenInAnotherProject');

interface OpenInAnotherProjectProps {
  feature: WfsFeature;
}

@observer
export class OpenInAnotherProject extends Component<OpenInAnotherProjectProps> {
  @observable private dialogOpen = false;
  @observable private connections: DataTableConnection[] = [];
  private connectionsFetchingOperationId: symbol;

  private cols: XTableColumn<CrgProject>[] = [
    {
      field: 'name',
      title: 'Название проекта',
      filterable: true,
      sortable: true
    }
  ];

  private sortParams: SortParams<CrgProject> = { asc: true, field: 'name' };

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
        <ChooseXTableDialog<CrgProject>
          title='Выбор проекта'
          actionButtonProps={{
            children: 'Открыть'
          }}
          items={this.projects}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='createdAt'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          getRowId={this.getItemId}
          single
        />
      </>
    );
  }

  private async fetchConnections() {
    const { feature } = this.props;
    const operationId = Symbol();
    this.connectionsFetchingOperationId = operationId;
    const connections = await getDataTableConnections(feature.id.split('.')[0]);
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
    const { layer } = this.connections.find(connection => connection.project.id === project.id);
    void this.navigateToObject(project, layer);
  }

  private getItemId(project: CrgProject): string {
    return String(project?.id);
  }

  @action
  private setConnections(connections: DataTableConnection[]) {
    this.connections = connections;
  }

  private async navigateToObject(project: CrgProject, layer: CrgLayer) {
    const { feature } = this.props;
    await services.provided;

    services.ngZone.run(() => {
      void services.router.navigate([`/projects/${project.id}/map`], {
        queryParams: { features: `${feature.id}${MAP_QUERY_PARAMS_DELIMITER}${layer.complexName}` }
      });
    });
  }
}
