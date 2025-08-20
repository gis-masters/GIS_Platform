import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { Schema } from '../../../../services/data/schema/schema.models';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { filterObjects } from '../../../../services/util/filters/filterObjects';
import { sortObjects } from '../../../../services/util/sortObjects';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CreateSchema } from '../../../CreateSchema/CreateSchema';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchemasRoot {
  static getId(): string {
    return 'schemasRoot';
  }

  static getTitle(): string {
    return 'Шаблоны схем';
  }

  static getDescription(): string {
    return 'Доступно только администратору организации';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <SchemaOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { page, pageSize, sort, sortOrder, filter }: PageOptions
  ): Promise<[ExplorerItemData[], number]> {
    const all = await schemaService.getAllSchemas();
    const filtered = filter?.text
      ? filterObjects(all, {
          $or: [
            { name: { $ilike: `%${String(filter.text)}%` } },
            { title: { $ilike: `%${String(filter.text)}%` } },
            { tags: { $elemMatch: { $ilike: `%${String(filter.text)}%` } } }
          ]
        })
      : all;
    const sorted = sortObjects<Schema>(filtered, sort as keyof Schema, sortOrder === SortOrder.ASC, 'name');
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped: ExplorerItemData[] = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize))];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { pageSize, sort, sortOrder, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const all = await schemaService.getAllSchemas();
    const filtered = filterObjects(all, filter || {});
    const sorted = sortObjects<Schema>(filtered, sort as keyof Schema, sortOrder === SortOrder.ASC, 'name');
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped: ExplorerItemData[] = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize)), page];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
    return {
      type: ExplorerItemType.SCHEMA,
      payload: await schemaService.getSchema(id)
    };
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Идентификатору',
        value: 'name'
      },
      {
        label: 'Названию',
        value: 'title'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'name';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.ASC;
  }

  static getChildrenFilterField(): string {
    return 'text';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр';
  }

  static getToolbarActions(): ReactNode {
    return <CreateSchema />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<Schema>>[] {
    return [communicationService.schemaUpdated];
  }
}
