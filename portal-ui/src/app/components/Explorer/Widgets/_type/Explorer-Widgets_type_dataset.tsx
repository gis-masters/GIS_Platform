import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { Dataset } from '../../../../services/data/vectorData/vectorData.models';
import { getDataset } from '../../../../services/data/vectorData/vectorData.service';
import { permissionsClient } from '../../../../services/permissions/permissions.client';
import { Role } from '../../../../services/permissions/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { assertExplorerItemDataTypeDataset } from '../../Adapter/_type/Explorer-Adapter_type_dataset';
import { getId } from '../../Adapter/Explorer-Adapter';
import { ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

@observer
class ExplorerWidgetsTypeDataset extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentDataset?: Dataset;
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
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentDataset && this.url && (
          <PermissionsWidget
            url={this.url}
            title={this.currentDataset.title}
            itemEntityType={ExplorerItemEntityTypeTitle.DATASET}
            disabled={!(currentUser.isAdmin || this.currentDataset.role === Role.OWNER)}
          />
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;

    assertExplorerItemDataTypeDataset(item);

    const operationId = Symbol();
    this.operationId = operationId;

    const url = permissionsClient.getDatasetRoleAssignmentsUrl(item.payload.identifier);
    const dataset = await getDataset(item.payload.identifier);

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
