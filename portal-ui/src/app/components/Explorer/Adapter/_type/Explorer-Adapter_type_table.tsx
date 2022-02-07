import React, { ReactNode } from 'react';
import moment from 'moment';
import { DataTable, getDataTable } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { getTableRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { Adapter, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerProps } from '../../Explorer';
import { DataTableActions } from '../../../DataTableActions/DataTableActions';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: DataTable;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<DataTable>): string {
    return `${item.payload.dataset}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<DataTable>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DataTable>): ReactNode {
    const { details, createdAt } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt ? (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </ExplorerInfoDescItem>
        ) : null}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<DataTable>): string {
    return item.payload.identifier;
  }

  static async getWidgets(
    item: ExplorerItemData<DataTable>,
    Explorer: React.ComponentType<ExplorerProps>
  ): Promise<ReactNode> {
    const { dataset, identifier, title } = item.payload;
    const url = await getTableRoleAssignmentUrl(dataset, identifier);
    const currentItem = await getDataTable(dataset, identifier);

    return (
      <>
        <ConnectionsTableToProjectsWidget dataTable={item.payload} Explorer={Explorer} />
        <PermissionsWidget
          url={url}
          title={title}
          itemEntityType={ExplorerItemEntityType.TABLE}
          disabled={!(currentUser.isAdmin || currentItem.role === Role.OWNER)}
        />
      </>
    );
  }

  static getIcon(item: ExplorerItemData<DataTable>): ReactNode {
    return <LayerIcon type='vector' schemaId={item.payload.schemaId} colorized />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<DataTable>): ReactNode {
    return <DataTableActions dataTable={item.payload} />;
  }
}
