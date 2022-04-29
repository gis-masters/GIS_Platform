import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { OldSchema } from '../../../../services/crg/schemaOld.models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { schemaService } from '../../../../services/crg/schema.service';
import { filterObjects } from '../../../../services/util/filterObjects';
import { sortObjects } from '../../../../services/util/sortObjects';
import { PageOptions, SortDir } from '../../../../services/models';

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
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<OldSchema>[], number]> {
    const all = await schemaService.getAllSchemas();
    const filtered = filter.name ? filterObjects(all, { name: { $ilike: `%${String(filter.name)}%` } }) : all;
    const sorted = sortObjects<OldSchema>(filtered, sort as keyof OldSchema, sortDir === SortDir.ASC, 'name');
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize))];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData<null>,
    { pageSize, sort, sortDir, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData<OldSchema>[], number, number]> | undefined {
    const all = await schemaService.getAllSchemas();
    const filtered = filterObjects(all, filter);
    const sorted = sortObjects<OldSchema>(filtered, sort as keyof OldSchema, sortDir === SortDir.ASC, 'name');
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped = paged.map(schema => ({ type: ExplorerItemType.SCHEMA, payload: schema }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize)), page];
  }

  static async getChildById(item: ExplorerItemData<null>, id: string): Promise<ExplorerItemData<OldSchema>> {
    return {
      type: ExplorerItemType.SCHEMA,
      payload: await schemaService.getOldSchema(id)
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

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.ASC;
  }

  static getChildrenFilterField(): string {
    return 'name';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по идентификатору';
  }
}
