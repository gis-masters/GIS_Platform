import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { OldSchema } from '../../../../services/data/schemaOld.models';
import SchemaActions from '../../../SchemaActions/SchemaActions.async';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.SCHEMA]: OldSchema;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeSchema {
  static getId(item: ExplorerItemData<OldSchema>): string {
    return item.payload.name;
  }

  static getTitle(item: ExplorerItemData<OldSchema>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<OldSchema>): ReactNode {
    return item.payload.description;
  }

  static getMeta(item: ExplorerItemData<OldSchema>): string {
    return item.payload.name;
  }

  static getIcon(): ReactNode {
    return <SchemaOutlined />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<OldSchema>): ReactNode {
    return <SchemaActions schema={item.payload} as='iconButton' />;
  }
}
