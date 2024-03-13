import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { Schema } from '../../../../services/data/schema/schema.models';
import { SchemaActions } from '../../../SchemaActions/SchemaActions';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

@staticImplements<Adapter<Schema>>()
export class ExplorerAdapterTypeSchema {
  static getId(item: ExplorerItemData<Schema>): string {
    return item.payload.name;
  }

  static getTitle(item: ExplorerItemData<Schema>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<Schema>): ReactNode {
    return item.payload.description;
  }

  static getMeta(item: ExplorerItemData<Schema>): string {
    return item.payload.name;
  }

  static getIcon(): ReactNode {
    return <SchemaOutlined />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<Schema>): ReactNode {
    return <SchemaActions schema={item.payload} as='iconButton' />;
  }
}
