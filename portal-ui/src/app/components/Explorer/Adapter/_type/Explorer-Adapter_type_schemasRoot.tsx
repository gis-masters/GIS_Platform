import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { schemaService } from '../../../../services/data/schema/schema.service';
import { filterObjects } from '../../../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../../../services/models';
import { sortObjects } from '../../../../services/util/sortObjects';
import { CreateSchema } from '../../../CreateSchema/CreateSchema';
import { Schema } from '../../../../services/data/schema/schema.models';
import { Emitter } from '../../../../services/common/Emitter';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.SCHEMAS_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchemasRoot {
  static getId(): string {
    return 'schemasRoot';
  }

  static getTitle(): string {
    return 'Схемы данных';
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
    item: ExplorerItemData<null>,
    { page, pageSize, sort, sortOrder, filter }: PageOptions
  ): Promise<[ExplorerItemData<Schema>[], number]> {
    const all = await schemaService.getAllSchemas();
    const filtered = filter.name ? filterObjects(all, { name: { $ilike: `%${String(filter.name)}%` } }) : all;
    const sorted = sortObjects<Schema>(filtered, sort as keyof Schema, sortOrder === SortOrder.ASC, 'name');
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize))];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<null>,
    { pageSize, sort, sortOrder, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData<Schema>[], number, number]> | undefined {
    const all = await schemaService.getAllSchemas();
    const filtered = filterObjects(all, filter);
    const sorted = sortObjects<Schema>(filtered, sort as keyof Schema, sortOrder === SortOrder.ASC, 'name');
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize)), page];
  }

  static async getChildById(item: ExplorerItemData<null>, id: string): Promise<ExplorerItemData<Schema>> {
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
    return 'name';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по идентификатору';
  }

  static getToolbarActions(): ReactNode {
    return <CreateSchema />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<Schema>>[] {
    return [communicationService.schemaUpdated];
  }
}
