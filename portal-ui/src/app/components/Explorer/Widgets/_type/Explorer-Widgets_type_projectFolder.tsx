import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { CrgProject } from '../../../../services/gis/projects/projects.models';
import { projectsService } from '../../../../services/gis/projects/projects.service';
import { permissionsClient } from '../../../../services/permissions/permissions.client';
import { Role } from '../../../../services/permissions/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { crgProjectFolderSchema, crgProjectSchema } from '../../../ProjectActions/ProjectActions';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { assertExplorerItemDataTypeProjectFolder } from '../../Adapter/_type/Explorer-Adapter_type_projectFolder';
import { getId } from '../../Adapter/Explorer-Adapter';
import { ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

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
    const { item, store } = this.props;

    if (getId(item, store) !== getId(prevProps.item, store)) {
      await this.fetchData();
    }

    communicationService.projectUpdated.on(async (e: CustomEvent<DataChangeEventDetail<CrgProject>>) => {
      const { type, data } = e.detail;
      if (
        getId({ type: ExplorerItemType.PROJECT_FOLDER, payload: data }, store) === getId(item, store) &&
        type !== 'delete'
      ) {
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
              <ViewContentWidget
                schema={this.project.folder ? crgProjectFolderSchema : crgProjectSchema}
                data={this.project}
                title='Свойства папки проекта'
              />
            </ExplorerInfoDescItem>

            <PermissionsWidget
              url={this.url}
              title={this.project.name}
              itemEntityType={ExplorerItemEntityTypeTitle.PROJECT_FOLDER}
              disabled={!(currentUser.isAdmin || this.project.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;

    assertExplorerItemDataTypeProjectFolder(item);

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

export const withTypeProjectFolder = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.PROJECT_FOLDER },
  () => ExplorerWidgetsTypeProject
);
