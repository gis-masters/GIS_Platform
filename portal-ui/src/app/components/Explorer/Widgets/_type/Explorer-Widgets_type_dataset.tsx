import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { permissionsClient } from '../../../../services/data/permissions/permissions.client';
import { getDataset } from '../../../../services/data/vectorData/vectorData.service';
import { Dataset } from '../../../../services/data/vectorData/vectorData.models';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
class ExplorerWidgetsTypeDataset extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentDataset?: Dataset;
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
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentDataset && (
          <>
            <PermissionsWidget
              url={this.url}
              title={this.currentDataset.title}
              itemEntityType={ExplorerItemEntityTypeTitle.DATASET}
              disabled={!(currentUser.isAdmin || this.currentDataset.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<Dataset>;

    const operationId = Symbol();
    this.operationId = operationId;

    const url = permissionsClient.getDatasetRoleAssignmentsUrl(payload.identifier);
    const dataset = await getDataset(payload.identifier);

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setCurrentDataset(dataset);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setCurrentDataset(dataset: Dataset) {
    this.currentDataset = dataset;
  }
}

export const withTypeDataset = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.DATASET },
  () => ExplorerWidgetsTypeDataset
);
