import React, { type ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { type Emitter } from '../../../../services/common/Emitter';
import { communicationService, type DataChangeEventDetail } from '../../../../services/communication.service';
import { type Schema } from '../../../../services/data/schema/schema.models';
import { type SchemaTemplate } from '../../../../services/data/schemaTemplate/schemaTemplate.models';
import { schemaTemplateService } from '../../../../services/data/schemaTemplate/schemaTemplate.service';
import { type PageOptions, SortOrder } from '../../../../services/models';
import { filterObjects } from '../../../../services/util/filters/filterObjects';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CreateSchema } from '../../../CreateSchema/CreateSchema';
import { type Adapter, type ExplorerItemData, ExplorerItemType, type SortItem } from '../../Explorer.models';

function sortSchemaTemplates(templates: SchemaTemplate[], sort: string | undefined, asc: boolean): SchemaTemplate[] {
  const fallBack = 'name';

  return [...templates].toSorted((a, b) => {
    const compare = (field: string): number => {
      const valueA = field === 'title' ? a.classRule.title : a.name;
      const valueB = field === 'title' ? b.classRule.title : b.name;
      const normalizedA = typeof valueA === 'string' ? valueA.toLowerCase() : valueA;
      const normalizedB = typeof valueB === 'string' ? valueB.toLowerCase() : valueB;

      if (normalizedA > normalizedB) {
        return asc ? 1 : -1;
      }

      if (normalizedA < normalizedB) {
        return asc ? -1 : 1;
      }

      return 0;
    };

    return compare(sort || fallBack) || (sort === fallBack ? 0 : compare(fallBack));
  });
}

function filterSchemaTemplates(templates: SchemaTemplate[], filterText: string): SchemaTemplate[] {
  if (!filterText) {
    return templates;
  }

  return filterObjects(templates, {
    $or: [
      { name: { $ilike: `%${filterText}%` } },
      { 'classRule.name': { $ilike: `%${filterText}%` } },
      { 'classRule.title': { $ilike: `%${filterText}%` } },
      { 'classRule.tags': { $elemMatch: { $ilike: `%${filterText}%` } } }
    ]
  });
}

function wrapTemplates(templates: SchemaTemplate[]): ExplorerItemData[] {
  return templates.map(payload => ({ type: ExplorerItemType.SCHEMA_TEMPLATE, payload }));
}

function getTotalPages(length: number, pageSize: number): number {
  return Math.floor(length / pageSize) + Number(Boolean(length / pageSize));
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchemaTemplatesRoot {
  static getId(): string {
    return 'schemaTemplatesRoot';
  }

  static getTitle(): string {
    return 'Шаблоны схем';
  }

  static getDescription(): string {
    return (
      'В этом разделе хранятся описания таблиц в JSON формате. Используя шаблоны схем можно создавать векторные' +
      ' таблицы или библиотеки документов, а так же управлять атрибутами этих созданных таблицы, например скрывая их' +
      ' или делая обязательными для заполнения.'
    );
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
    const templates = await schemaTemplateService.getSchemaTemplates();
    const filterText = typeof filter?.text === 'string' ? filter.text : '';
    const filtered = filterSchemaTemplates(templates, filterText);
    const sorted = sortSchemaTemplates(filtered, sort, sortOrder === SortOrder.ASC);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

    return [wrapTemplates(paged), getTotalPages(sorted.length, pageSize)];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { pageSize, sort, sortOrder, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const templates = await schemaTemplateService.getSchemaTemplates();
    const filterText = typeof filter?.text === 'string' ? filter.text : '';
    const filtered = filterText ? filterSchemaTemplates(templates, filterText) : filterObjects(templates, filter || {});
    const sorted = sortSchemaTemplates(filtered, sort, sortOrder === SortOrder.ASC);
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

    return [wrapTemplates(paged), getTotalPages(sorted.length, pageSize), page];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
    const template = await schemaTemplateService.getSchemaTemplate(id);

    return {
      type: ExplorerItemType.SCHEMA_TEMPLATE,
      payload: template
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
