import React, { ReactNode } from 'react';
import { VectorTable } from '../../../../services/data/vectorData/vectorData.models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { VectorTableActions } from '../../../VectorTableActions/VectorTableActions';
import { Link } from '../../../Link/Link';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: VectorTable;
  }
}

@staticImplements<Adapter<VectorTable>>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<VectorTable>): string {
    return item.payload.identifier;
  }

  static getTitle(item: ExplorerItemData<VectorTable>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<VectorTable>): ReactNode {
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

  static getMeta(item: ExplorerItemData<VectorTable>): string {
    return item.payload.identifier;
  }

  static getIcon(item: ExplorerItemData<VectorTable>): ReactNode {
    return <LayerIcon type='vector' schemaId={item.payload.schemaId} colorized />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<VectorTable>): ReactNode {
    return <VectorTableActions vectorTable={item.payload} />;
  }
}
