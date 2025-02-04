import React, { ReactNode } from 'react';

import { getFileExtension, isTifFile, normalizeExtension } from '../../../../services/data/files/files.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { FileIcon } from '../../../FileIcon/FileIcon';
import { FileTiff } from '../../../Icons/FileTiff';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';

function assertExplorerItemDataTypeFile(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.FILE] {
  if (item.type !== ExplorerItemType.FILE) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFile {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeFile(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeFile(item);

    return item.payload.title;
  }

  static getMeta = ExplorerAdapterTypeFile.getId;

  static getIcon(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeFile(item);

    return isTifFile(item.payload) ? (
      <FileTiff color='primary' />
    ) : (
      <FileIcon ext={normalizeExtension(getFileExtension(item.payload.title))} color='primary' />
    );
  }

  static isFolder(): boolean {
    return false;
  }
}
