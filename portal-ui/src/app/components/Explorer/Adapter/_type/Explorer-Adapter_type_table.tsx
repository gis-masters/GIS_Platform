import React, { ReactNode } from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';

import { isTableDeletionAllowed } from '../../../../services/crg/permissions.service';
import { DataTable, deleteDataTable, getDataTableConnections } from '../../../../services/data.service';
import { communicationService } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { Emitter } from '../../../../services/util/Emitter';

import { Adapter, AllowedActions, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

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

  static getIcon(item: ExplorerItemData<DataTable>): ReactNode {
    return <LayerIcon type='vector' schemaId={item.payload.schemaId} colorized />;
  }

  static isFolder(): boolean {
    return false;
  }

  static async getAllowedActions(item: ExplorerItemData<DataTable>): Promise<AllowedActions> {
    const { dataset, identifier } = item.payload;
    const deletionAllowed = await isTableDeletionAllowed(dataset, identifier);
    const count = (await getDataTableConnections(identifier)).length;
    const textProjects = pluralize(count, 'проекте', 'проектах', 'проектах');
    const textUsed = `В ${count} ${textProjects} есть слои, которые используют этот источник данных. Эти слои также будут удалены.`;
    const textNotUsed = 'Не используется в проектах.';

    return {
      delete: {
        visible: true,
        disabled: !deletionAllowed,
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
