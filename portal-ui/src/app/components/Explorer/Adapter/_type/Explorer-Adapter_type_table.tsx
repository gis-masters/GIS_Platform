import React from 'react';
import moment from 'moment';

import { DataTable } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LayerIcon } from '../../../LayerIcon/LayerIcon.composed';

import { ExplorerItemData } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: DataTable;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<DataTable>) {
    return `${item.type}:${item.payload.dataset}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<DataTable>) {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<DataTable>) {
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

  static getMeta(item: ExplorerItemData<DataTable>) {
    return item.payload.identifier;
  }

  static getIcon(item: ExplorerItemData<DataTable>) {
    return <LayerIcon type='vector' schemaId={item.payload.schemaId} colorized />;
  }

  static isFolder() {
    return false;
  }
}
