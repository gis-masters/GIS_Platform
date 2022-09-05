import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { getProjectPermissionsUrl } from '../../../../services/server-urls.service';
import { communicationService } from '../../../../services/communication.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { projectsService } from '../../../../services/gis/projects.service';
import { crgProjectSchema } from '../../../ProjectsActions/ProjectsActions';
import { CrgProject } from '../../../../services/gis/projects.models';
import { Role } from '../../../../services/data/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Schema } from '../../../../services/data/schema.models';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
class ExplorerWidgetsTypeProject extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentProject?: Record<string, unknown>;
  private operationId: symbol;

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

    communicationService.projectsUpdated.on(async () => {
      await this.fetchData();
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentProject && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget schema={crgProjectSchema as unknown as Schema} data={this.currentProject} />
            </ExplorerInfoDescItem>

            <PermissionsWidget
              url={this.url}
              title={this.currentProject.name as string}
              itemEntityType={ExplorerItemEntityTypeTitle.PROJECT}
              disabled={!(currentUser.isAdmin || this.currentProject.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<CrgProject>;

    const operationId = Symbol();
    this.operationId = operationId;

    const url = await getProjectPermissionsUrl(payload.id);
    const currentProject = (await projectsService.getById(payload.id)) as unknown as Record<string, unknown>;

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setCurrentProject(currentProject);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setCurrentProject(project: Record<string, unknown>) {
    this.currentProject = project;
  }
}

export const withTypeProject = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.PROJECT },
  () => ExplorerWidgetsTypeProject
);
