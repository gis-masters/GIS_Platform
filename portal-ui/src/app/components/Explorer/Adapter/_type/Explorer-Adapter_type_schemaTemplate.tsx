import React, { type ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { SchemaActions } from '../../../SchemaActions/SchemaActions';
import {
  type Adapter,
  type ExplorerItemData,
  type ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeSchemaTemplate(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.SCHEMA_TEMPLATE] {
  if (item.type !== ExplorerItemType.SCHEMA_TEMPLATE) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchemaTemplate {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSchemaTemplate(item);

    return item.payload.name;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeSchemaTemplate(item);

    return item.payload.classRule.title;
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSchemaTemplate(item);

    return item.payload.classRule.description;
  }

  static readonly getMeta = ExplorerAdapterTypeSchemaTemplate.getId;

  static getIcon(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSchemaTemplate(item);

    const canEdit = !item.payload.system && (currentUser.isAdmin || item.payload.createdBy === currentUser.login);

    return <SchemaOutlined color={canEdit ? 'primary' : undefined} />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeSchemaTemplate(item);

    return <SchemaActions schemaTemplate={item.payload} as='iconButton' />;
  }
}
