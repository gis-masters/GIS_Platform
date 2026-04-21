import React, { type ReactNode } from 'react';
import { SummarizeOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { ReportTemplateActions } from '../../../ReportTemplateActions/ReportTemplateActions';
import {
  type Adapter,
  type ExplorerItemData,
  type ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeReportTemplate(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.REPORT_TEMPLATE] {
  if (item.type !== ExplorerItemType.REPORT_TEMPLATE) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeReportTemplate {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeReportTemplate(item);

    return item.payload.name;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeReportTemplate(item);

    return item.payload.title;
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeReportTemplate(item);
    const p = item.payload;
    const { name } = p;

    return p.system ? `[системный] ${name}` : name;
  }

  static getIcon(): ReactNode {
    return <SummarizeOutlined />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeReportTemplate(item);

    return <ReportTemplateActions template={item.payload} />;
  }
}
