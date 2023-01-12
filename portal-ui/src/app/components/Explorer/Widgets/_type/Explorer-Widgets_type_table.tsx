import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { getVectorTable, VectorTable, vectorTableSchema } from '../../../../services/data/data.service';
import { getTableRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/data/permissions.models';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { communicationService, DataChangeEvent } from '../../../../services/communication.service';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
class ExplorerWidgetsTypeTable extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentTable?: VectorTable;
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

    communicationService.vectorTableUpdated.on(async ({ type, data }: DataChangeEvent<VectorTable>) => {
      if (getId({ type: ExplorerItemType.TABLE, payload: data }) === getId(item) && type !== 'delete') {
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
        {this.currentTable && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget
                schema={vectorTableSchema}
                data={this.currentTable}
                title='Свойства источника данных'
              />
            </ExplorerInfoDescItem>

            <ConnectionsTableToProjectsWidget vectorTable={this.currentTable} />

            <PermissionsWidget
              url={this.url}
              title={this.currentTable.title}
              itemEntityType={ExplorerItemEntityTypeTitle.TABLE}
              disabled={!(currentUser.isAdmin || this.currentTable.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<VectorTable>;

    const operationId = Symbol();
    this.operationId = operationId;

    const url = await getTableRoleAssignmentUrl(payload.dataset, payload.identifier);
    const table = await getVectorTable(payload.dataset, payload.identifier);

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setCurrentTable(table);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setCurrentTable(table: VectorTable) {
    this.currentTable = table;
  }
}

export const withTypeTable = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.TABLE },
  () => ExplorerWidgetsTypeTable
);
