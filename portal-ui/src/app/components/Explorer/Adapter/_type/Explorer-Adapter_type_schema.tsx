import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { SchemaActions } from '../../../SchemaActions/SchemaActions';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeSchema(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.SCHEMA] {
  if (item.type !== ExplorerItemType.SCHEMA) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchema {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSchema(item);

    return item.payload.name;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSchema(item);

    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSchema(item);

    return item.payload.description;
  }

  static getMeta = ExplorerAdapterTypeSchema.getId;

  static getIcon(): ReactNode {
    return <SchemaOutlined />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSchema(item);

    return <SchemaActions schema={item.payload} as='iconButton' />;
  }
}
