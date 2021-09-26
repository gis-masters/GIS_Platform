import React, { ReactNode } from 'react';
import moment from 'moment';
import { Storage } from '@material-ui/icons';

import { Dataset, DataTable, getDatasetTables } from '../../../../services/data.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { PageOptions, SortDir } from '../../../../services/models';

import { Adapter, ExplorerItemData, ExplorerItemType, ExplorerItemEntityType, SortItem } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { getDatasetRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DATASET]: Dataset;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDataset {
  static getId(item: ExplorerItemData<Dataset>): string {
    return `${item.type}:${item.payload.identifier}`;
  }

  static getTitle(item: ExplorerItemData<Dataset>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<Dataset>): ReactNode {
    const { details, itemsCount, createdAt } = item.payload;
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

        <p>
          <ExplorerInfoDescTitle>Таблиц:</ExplorerInfoDescTitle>
          {itemsCount}
        </p>
      </>
    );
  }

  static getMeta(item: ExplorerItemData<Dataset>): string {
    return item.payload.identifier;
  }

  static async getWidgets(item: ExplorerItemData<Dataset>): Promise<ReactNode> {
    const url = await getDatasetRoleAssignmentUrl(item.payload.identifier);

    return <PermissionsWidget url={url} title={item.payload.title} itemEntityType={ExplorerItemEntityType.DATASET} />;
  }

  static getIcon(): ReactNode {
    return <Storage color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData<Dataset>,
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<DataTable>[], number]> {
    const [tables, pagesCount] = await getDatasetTables(item.payload, { page, pageSize, sort, sortDir, filter });

    return [tables.map(payload => ({ type: ExplorerItemType.TABLE, payload })), pagesCount];
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'title'
      },
      {
        label: 'Дате создания',
        value: 'created_at'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'created_at';
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
