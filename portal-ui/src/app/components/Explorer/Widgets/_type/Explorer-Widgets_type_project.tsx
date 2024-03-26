import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { permissionsClient } from '../../../../services/data/permissions/permissions.client';
import { projectsService } from '../../../../services/gis/projects/projects.service';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { CrgProject } from '../../../../services/gis/projects/projects.models';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { crgProjectSchema } from '../../../ProjectsActions/ProjectsActions';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';
import { assertExplorerItemDataTypeProject } from '../../Adapter/_type/Explorer-Adapter_type_project';

@observer
class ExplorerWidgetsTypeProject extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private project?: CrgProject;
  private operationId?: symbol;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: Readonly<ExplorerWidgetsProps>) {
    const { item } = this.props;

    if (getId(item) !== getId(prevProps.item)) {
      await this.fetchData();
    }

    communicationService.projectUpdated.on(async (e: CustomEvent<DataChangeEventDetail<CrgProject>>) => {
      const { type, data } = e.detail;
      if (getId({ type: ExplorerItemType.PROJECT, payload: data }) === getId(item) && type !== 'delete') {
        await this.fetchData();
      }
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.project && this.url && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget schema={crgProjectSchema} data={this.project} title='Свойства проекта' />
            </ExplorerInfoDescItem>

            <PermissionsWidget
              url={this.url}
              title={this.project.name}
              itemEntityType={ExplorerItemEntityTypeTitle.PROJECT}
              disabled={!(currentUser.isAdmin || this.project.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;

    assertExplorerItemDataTypeProject(item);

    const operationId = Symbol();
    this.operationId = operationId;

    const url = permissionsClient.getProjectPermissionsUrl(item.payload.id);
    const project = await projectsService.getById(item.payload.id);

    if (this.operationId === operationId) {
      if (!project) {
        throw new Error(`Проект ${item.payload.id} not found`);
      }
      this.setUrl(url);
      this.setProject(project);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setProject(project: CrgProject) {
    this.project = project;
  }
}

export const withTypeProject = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.PROJECT },
  () => ExplorerWidgetsTypeProject
);
