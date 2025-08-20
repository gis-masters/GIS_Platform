import React, { ReactNode } from 'react';
import { Restore } from '@mui/icons-material';

import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LibraryDocumentVersionsActions } from '../../../LibraryDocumentVersionsActions/LibraryDocumentVersionsActions';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

export function assertExplorerItemDataTypeDocumentVersion(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.DOCUMENT_VERSION] {
  if (item.type !== ExplorerItemType.DOCUMENT_VERSION) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocumentVersion {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDocumentVersion(item);

    return item.payload.updatedTime;
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDocumentVersion(item);

    return item.payload.updatedByUser;
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDocumentVersion(item);

    return formatDate(item.payload.updatedTime, 'HH:mm DD.MM.YYYY');
  }

  static getIcon(): ReactNode {
    return <Restore color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDocumentVersion(item);

    return (
      <LibraryDocumentVersionsActions
        as='iconButton'
        document={item.payload.document}
        documentVersion={item.payload.content}
      />
    );
  }
}
