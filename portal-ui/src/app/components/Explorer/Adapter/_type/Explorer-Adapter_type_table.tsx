import React from 'react';
import moment from 'moment';
import { ViewList } from '@material-ui/icons';

import { DataTable } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';

import { ExplorerItemData } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TABLE]: DataTable;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTable {
  static getId(item: ExplorerItemData<DataTable>) {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<DataTable>) {
    return item.payload.title;
  }

  static getDetails(item: ExplorerItemData<DataTable>) {
    return item.payload.details;
  }

  static getMeta(item: ExplorerItemData<DataTable>) {
    const { createdAt, identifier } = item.payload;

    return `${createdAt ? moment(createdAt).format('LL') : ''} (${identifier})`;
  }

  static getIcon() {
    return <ViewList />;
  }

  static isFolder() {
    return false;
  }
}
