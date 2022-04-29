import React, { ReactNode } from 'react';
import { SchemaOutlined } from '@mui/icons-material';

import { OldSchema } from '../../../../services/crg/schemaOld.models';
import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { FormViewValue } from '../../../Form/ViewValue/Form-ViewValue';

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

  static getWidgets(item: ExplorerItemData<OldSchema>): ReactNode {
    return (
      <ExplorerInfoDescItem multiline>
        <FormViewValue code>{JSON.stringify(item.payload, null, 2)}</FormViewValue>
      </ExplorerInfoDescItem>
    );
  }

  static getIcon(): ReactNode {
    return <SchemaOutlined />;
  }

  static isFolder(): boolean {
    return false;
  }
}
