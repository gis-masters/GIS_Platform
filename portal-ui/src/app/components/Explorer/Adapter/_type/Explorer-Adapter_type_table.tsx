import React, { ReactNode } from 'react';
import { DataTable, dataTableSchema, getDataTable } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { getTableRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { DataTableActions } from '../../../DataTableActions/DataTableActions';
import { Link } from '../../../Link/Link';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: DataTable;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<DataTable>): string {
    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData<DataTable>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DataTable>): ReactNode {
    const { details, createdAt, schemaId } = item.payload;

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
          </ExplorerInfoDescItem>
        )}

        {currentUser.isAdmin && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Схема:</ExplorerInfoDescTitle>
            <Link href={`/data-management?path_dm=%5B"r","root","sr","schemasRoot","schema","${schemaId}"%5D`}>
              {schemaId}
            </Link>
          </ExplorerInfoDescItem>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<DataTable>): string {
    return item.payload.identifier;
  }

  static async getWidgets(item: ExplorerItemData<DataTable>): Promise<ReactNode> {
    const { dataset, identifier, title } = item.payload;
    const url = await getTableRoleAssignmentUrl(dataset, identifier);
    const currentItem = (await getDataTable(dataset, identifier)) as unknown as Record<string, unknown>;

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget fields={dataTableSchema} data={currentItem} />
        </ExplorerInfoDescItem>

        <ConnectionsTableToProjectsWidget dataTable={item.payload} />
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
