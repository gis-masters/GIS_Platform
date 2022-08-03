import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { OldSchema } from '../../../../services/data/schemaOld.models';
import { staticImplements } from '../../../../services/util/staticImplements';

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
}
