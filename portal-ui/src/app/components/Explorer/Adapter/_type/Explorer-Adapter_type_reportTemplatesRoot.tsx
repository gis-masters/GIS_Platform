import React, { type ReactNode } from 'react';
import { SummarizeOutlined } from '@mui/icons-material';

import { type Emitter } from '../../../../services/common/Emitter';
import { communicationService, type DataChangeEventDetail } from '../../../../services/communication.service';
import { type PageOptions, SortOrder } from '../../../../services/models';
import { type TemplateInfo } from '../../../../services/report/reportTemplate/reportTemplate.models';
import { getTemplate, getTemplates } from '../../../../services/report/reportTemplate/reportTemplate.service';
import { filterObjects } from '../../../../services/util/filters/filterObjects';
import { sortObjects } from '../../../../services/util/sortObjects';
import { staticImplements } from '../../../../services/util/staticImplements';
import { CreateReportTemplate } from '../../../CreateReportTemplate/CreateReportTemplate';
import { type Adapter, type ExplorerItemData, ExplorerItemType, type SortItem } from '../../Explorer.models';

@staticImplements<Adapter>()
export class ExplorerAdapterTypeReportTemplatesRoot {
  static getId(): string {
    return 'reportTemplatesRoot';
  }

  static getTitle(): string {
    return 'Шаблоны отчётов';
  }

  static getDescription(): string {
    return 'Шаблоны печатных отчётов: на их основе формируются документы для печати и выгрузки. Доступно только администратору организации.';
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
    const filtered = filter?.text
      ? filterObjects(all, {
          $or: [{ name: { $ilike: `%${String(filter.text)}%` } }, { title: { $ilike: `%${String(filter.text)}%` } }]
        })
      : all;
    const sorted = sortObjects<TemplateInfo>(filtered, sort as keyof TemplateInfo, sortOrder === SortOrder.ASC, 'name');
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped: ExplorerItemData[] = paged.map(payload => ({
      type: ExplorerItemType.REPORT_TEMPLATE,
      payload
    }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize))];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { pageSize, sort, sortOrder, filter }: PageOptions,
    id: string
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const all = await getTemplates();
    const filtered = filterObjects(all, filter || {});
    const sorted = sortObjects<TemplateInfo>(filtered, sort as keyof TemplateInfo, sortOrder === SortOrder.ASC, 'name');
    const index = sorted.findIndex(({ name }) => name === id);

    if (index === -1) {
      return;
    }

    const page = Math.floor(index / pageSize);
    const paged = sorted.slice(page * pageSize, page * pageSize + pageSize);
    const wrapped: ExplorerItemData[] = paged.map(payload => ({
      type: ExplorerItemType.REPORT_TEMPLATE,
      payload
    }));

    return [wrapped, Math.floor(sorted.length / pageSize) + Number(Boolean(sorted.length / pageSize)), page];
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
    return <CreateReportTemplate />;
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<TemplateInfo>>[] {
    return [communicationService.reportTemplateUpdated];
  }
}
