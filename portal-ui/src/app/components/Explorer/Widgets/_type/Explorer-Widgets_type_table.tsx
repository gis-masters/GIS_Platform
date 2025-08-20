import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { VectorTable, vectorTableSchema } from '../../../../services/data/vectorData/vectorData.models';
import { getVectorTable } from '../../../../services/data/vectorData/vectorData.service';
import { permissionsClient } from '../../../../services/permissions/permissions.client';
import { Role } from '../../../../services/permissions/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { assertExplorerItemDataTypeTable } from '../../Adapter/_type/Explorer-Adapter_type_table';
import { getId } from '../../Adapter/Explorer-Adapter';
import { ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

@observer
class ExplorerWidgetsTypeTable extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentTable?: VectorTable;
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

    communicationService.vectorTableUpdated.on(async (e: CustomEvent<DataChangeEventDetail<VectorTable>>) => {
      const { type, data } = e.detail;
      if (getId({ type: ExplorerItemType.TABLE, payload: data }, store) === getId(item, store) && type !== 'delete') {
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
        {this.currentTable && this.url && (
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

    assertExplorerItemDataTypeTable(item);

    const operationId = Symbol();
    this.operationId = operationId;

    const url = permissionsClient.getTableRoleAssignmentsUrl(item.payload.dataset, item.payload.identifier);
    const table = await getVectorTable(item.payload.dataset, item.payload.identifier);

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
