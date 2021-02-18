import React from 'react';
import moment from 'moment';
import { pluralize } from 'numeralize-ru';
import { FolderOutlined } from '@material-ui/icons';

import { SortDir } from '../../../../services/models';
import { LibraryItem } from '../../../../services/crg/doc-library.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FOLDER]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFolder {
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
    return <FolderOutlined />;
  }

  static isFolder() {
    return true;
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      },
      {
        label: 'Дате создания',
        value: 'createdAt'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'createdAt';
  }

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
  }

  static getChildrenFilterField(): string {
    return 'title';
  }

  static getChildrenFilterLabel(): string {
    return 'Поиск по названию';
  }
}
