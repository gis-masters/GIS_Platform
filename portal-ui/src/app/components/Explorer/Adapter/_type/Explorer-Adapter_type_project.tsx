import React, { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { MapOutlined } from '@mui/icons-material';

import { services } from '../../../../services/services';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { ProjectActions } from '../../../ProjectActions/ProjectActions';
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
    return true;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeProject(item);

    return <ProjectActions project={item.payload} as='iconButton' />;
  }

  static customOpenActionIcon(): ReactNode {
    return (
      <Tooltip title='Открыть'>
        <MapOutlined />
      </Tooltip>
    );
  }

  static async customOpenAction(item: ExplorerItemData): Promise<void> {
    assertExplorerItemDataTypeProject(item);

    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl(`/projects/${item.payload.id}/map`);
      }, 0);
    });
  }
}
