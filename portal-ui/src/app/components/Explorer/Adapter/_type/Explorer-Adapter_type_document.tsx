import React from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { InsertDriveFile } from '@material-ui/icons';

import { LibraryItem } from '../../../../services/crg/doc-library.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData<LibraryItem>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryItem>) {
    return item.payload.title;
  }

  static getMeta(item: ExplorerItemData<LibraryItem>) {
    const { itemsCount, created_at, id } = item.payload;
    moment.locale('ru');
    const date = created_at ? `${moment(created_at).format('LL')}` : '';
    const counter = itemsCount
      ? `${itemsCount} ${pluralize(Number(itemsCount), 'элемент', 'элемента', 'элементов')}, `
      : '';

    return `${counter} ${date} (${id})`;
  }

  static getIcon() {
    return <InsertDriveFile />;
  }

  static isFolder() {
    return false;
  }
}
