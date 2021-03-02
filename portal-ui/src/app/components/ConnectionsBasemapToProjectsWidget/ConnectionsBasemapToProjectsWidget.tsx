import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { allProjects } from '../../stores/AllProjects.store';
import { Basemap } from '../../services/crg/basemaps.models';
import { CrgProject } from '../../services/crg/projects.models';
import { projectsService } from '../../services/crg/projects.service';
import { communicationService } from '../../services/communication.service';
import { connectBasemapToProject } from '../../services/crg/basemaps.service';
import { ConnectionsToProjectsWidget } from '../ConnectionsToProjectsWidget/ConnectionsToProjectsWidget';
import { ExplorerProps } from '../Explorer/Explorer';

const cnConnectionsBasemapToProjectsWidget = cn('ConnectionsBasemapToProjectsWidget');

interface ConnectionsBasemapToProjectsWidgetProps {
  basemap: Basemap;
  Explorer: React.ComponentType<ExplorerProps>;
}

@observer
export class ConnectionsBasemapToProjectsWidget extends Component<ConnectionsBasemapToProjectsWidgetProps> {
  @observable private loading = true;

  async componentDidMount() {
    await projectsService.initAllProjectsStore();
    this.setLoading(false);
    communicationService.projectsUpdated.on(() => {
      this.setLoading(true);
    }, this);
    communicationService.allProjectsFetched.on(() => {
      this.setLoading(false);
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { Explorer } = this.props;

    return (
      <ConnectionsToProjectsWidget
        className={cnConnectionsBasemapToProjectsWidget()}
        Explorer={Explorer}
        onConnect={this.connectHandler}
        connectedProjects={this.connections}
        loading={this.loading}
      />
    );
  }

  @computed
  private get connections(): CrgProject[] {
    const { basemap } = this.props;

    return allProjects.list.filter(({ baseMaps }) =>
      (baseMaps || []).some(({ baseMapId }) => baseMapId === basemap.id)
    );
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async connectHandler(project: CrgProject) {
    const { basemap } = this.props;
    await connectBasemapToProject(project, basemap);
    communicationService.projectsUpdated.emit();
  }
}
