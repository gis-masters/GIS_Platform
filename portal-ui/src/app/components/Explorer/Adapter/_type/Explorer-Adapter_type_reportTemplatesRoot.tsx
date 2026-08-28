import React, { type ReactNode } from 'react';
import { SummarizeOutlined } from '@mui/icons-material';

import { type Emitter } from '../../../../services/common/Emitter';
import { communicationService, type DataChangeEventDetail } from '../../../../services/communication.service';
import { type PageOptions, SortOrder } from '../../../../services/models';
import { type TemplateInfo } from '../../../../services/reportTemplate/reportTemplate.models';
import { getTemplate, getTemplates } from '../../../../services/reportTemplate/reportTemplate.service';
import { isTemplateInfo } from '../../../../services/reportTemplate/reportTemplate.typeguards';
import { filterObjects } from '../../../../services/util/filters/filterObjects';
import { sortObjects } from '../../../../services/util/sortObjects';
import { staticImplements } from '../../../../services/util/staticImplements';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { CreateReportTemplate } from '../../../CreateReportTemplate/CreateReportTemplate';
import { type Adapter, type ExplorerItemData, ExplorerItemType, type SortItem } from '../../Explorer.models';

function filterReportTemplates(templates: TemplateInfo[], filterText: string): TemplateInfo[] {
  if (!filterText) {
    return templates;
  }

  return filterObjects(templates, {
    $or: [{ name: { $ilike: `%${filterText}%` } }, { title: { $ilike: `%${filterText}%` } }]
  });
}

function sortReportTemplates(templates: TemplateInfo[], sort: string | undefined, asc: boolean): TemplateInfo[] {
  return sortObjects<TemplateInfo>(templates, (sort as keyof TemplateInfo) || 'name', asc, 'name');
}

function wrapReportTemplates(templates: TemplateInfo[]): ExplorerItemData[] {
  return templates.map(payload => ({
    type: ExplorerItemType.REPORT_TEMPLATE,
    payload
  }));
}

function getTotalPages(length: number, pageSize: number): number {
  return Math.floor(length / pageSize) + Number(Boolean(length / pageSize));
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeReportTemplatesRoot {
  static getId(): string {
    return 'reportTemplatesRoot';
  }

  static getTitle(): string {
    return 'Шаблоны отчётов';
  }

  static getDescription(): string {
    return 'Шаблоны печатных отчётов: на их основе формируются документы для печати и выгрузки. Создание и удаление шаблонов доступно администратору организации.';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <SummarizeOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { page, pageSize, sort, sortOrder, filter }: PageOptions
  ): Promise<[ExplorerItemData[], number]> {
    const all = await getTemplates();
    const filterText = typeof filter?.text === 'string' ? filter.text : '';
    const filtered = filterReportTemplates(all, filterText);
    const sorted = sortReportTemplates(filtered, sort, sortOrder === SortOrder.ASC);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

    return [wrapReportTemplates(paged), getTotalPages(sorted.length, pageSize)];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { pageSize, sort, sortOrder, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const all = await getTemplates();
    const filterText = typeof filter?.text === 'string' ? filter.text : '';
    const filtered = filterReportTemplates(all, filterText);
    const sorted = sortReportTemplates(filtered, sort, sortOrder === SortOrder.ASC);
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);

    return [wrapReportTemplates(paged), getTotalPages(sorted.length, pageSize), page];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
    return {
      type: ExplorerItemType.REPORT_TEMPLATE,
      payload: await getTemplate(id)
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
    if (currentUser.isAdmin) {
      return <CreateReportTemplate />;
    }

    return null;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<TemplateInfo>>[] {
    return [communicationService.reportTemplateUpdated];
  }

  static wrapCreatedChild(item: ExplorerItemData, data: unknown): ExplorerItemData | undefined {
    if (!isTemplateInfo(data)) {
      return;
    }

    return { type: ExplorerItemType.REPORT_TEMPLATE, payload: data };
  }
}
