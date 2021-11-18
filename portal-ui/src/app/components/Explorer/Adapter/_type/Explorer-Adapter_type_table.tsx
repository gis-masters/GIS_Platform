import React, { ReactNode } from 'react';
import moment from 'moment';
import { SaveOutlined } from '@mui/icons-material';
import { pluralize } from 'numeralize-ru';

import { isTableDeletionAllowed } from '../../../../services/crg/permissions.service';
import {
  dataEntitySchema,
  DataTable,
  deleteDataTable,
  getDataTable,
  getDataTableConnections,
  updateDataTable
} from '../../../../services/data.service';
import { getPatch } from '../../../../services/util/patch';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { getTableRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { ConnectionsTableToProjectsWidget } from '../../../ConnectionsTableToProjectsWidget/ConnectionsTableToProjectsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { TextBadge } from '../../../TextBadge/TextBadge';

import { ActionType, Adapter, AllowedActions, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerProps } from '../../Explorer';

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

  static async getAllowedActions(item: ExplorerItemData<DataTable>): Promise<AllowedActions> {
    const { dataset, identifier, title } = item.payload;
    const deletionAllowed = await isTableDeletionAllowed(dataset, identifier);
    const count = (await getDataTableConnections(identifier)).length;
    const textProjects = pluralize(count, 'проекте', 'проектах', 'проектах');
    const textUsed = `В ${count} ${textProjects} есть слои, которые используют этот источник данных. Эти слои также будут удалены.`;
    const textNotUsed = 'Не используется в проектах.';
    const currentItem = await getDataTable(dataset, identifier);

    return {
      [ActionType.EDIT]: {
        visible: false, // не работает на стороне сервера
        disabled: !(currentUser.isAdmin || currentItem.role === Role.OWNER || currentItem.role === Role.CONTRIBUTOR),
        fields: dataEntitySchema,
        payload: item.payload as unknown as Record<string, DataTable[keyof DataTable]>,
        actionFunction: async (value: DataTable) => {
          await updateDataTable(dataset, identifier, getPatch(value, item.payload));
        },
        dialogTitle: (
          <>
            Редактирование таблицы векторного слоя
            <TextBadge id={identifier} />
          </>
        ),
        actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' }
      },

      [ActionType.DELETE]: {
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
}
