import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';
import { ProjectsActions } from '../../../ProjectsActions/ProjectsActions';

import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeProject(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.PROJECT] {
  if (item.type !== ExplorerItemType.PROJECT) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProject {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProject(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProject(item);

    return item.payload.name;
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProject(item);

    const { createdAt, id } = item.payload;
    const date = createdAt ? `${formatDate(createdAt, 'LL')}` : '';

    return `${date} (id: ${id})`;
  }

  static getIcon(): ReactNode {
    return <MapOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeProject(item);

    return <ProjectsActions project={item.payload} />;
  }
}
