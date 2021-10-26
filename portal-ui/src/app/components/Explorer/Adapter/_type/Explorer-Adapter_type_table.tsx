import React, { ReactNode } from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';

import { isTableDeletionAllowed } from '../../../../services/crg/permissions.service';
import { DataTable, deleteDataTable, getDataTable, getDataTableConnections } from '../../../../services/data.service';
import { communicationService } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { Emitter } from '../../../../services/common/Emitter';
import { getTableRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';

import { Adapter, AllowedActions, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ExplorerProps } from '../../Explorer';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: DataTable;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<DataTable>): string {
    return `${item.type}:${item.payload.dataset}:${item.payload.identifier}`;
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
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </p>
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

  static async getAllowedActions(item: ExplorerItemData<DataTable>): Promise<AllowedActions> {
    const { dataset, identifier, title } = item.payload;
    const deletionAllowed = await isTableDeletionAllowed(dataset, identifier);
    const count = (await getDataTableConnections(identifier)).length;
    const textProjects = pluralize(count, 'проекте', 'проектах', 'проектах');
    const textUsed = `В ${count} ${textProjects} есть слои, которые используют этот источник данных. Эти слои также будут удалены.`;
    const textNotUsed = 'Не используется в проектах.';

    return {
      delete: {
        visible: true,
        disabled: !deletionAllowed,
        itemTitle: title,
        needConfirmation: true,
        confirmationText: count ? textUsed : textNotUsed
      }
    };
  }

  static async deleteItem(item: ExplorerItemData<DataTable>): Promise<void> {
    await deleteDataTable(item.payload.dataset, item.payload.identifier);
  }

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.dataTablesUpdated];
  }
}
