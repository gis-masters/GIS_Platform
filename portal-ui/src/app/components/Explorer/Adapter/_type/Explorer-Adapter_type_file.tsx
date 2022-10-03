import React, { ReactNode } from 'react';

import { staticImplements } from '../../../../services/util/staticImplements';
import { FileInfo } from '../../../../services/data/files.service';
import { getFileExtension, isTifFile, normalizeExtension } from '../../../../services/data/files.util';
import { FileIcon } from '../../../FileIcon/FileIcon';
import { FileTiff } from '../../../Icons/FileTiff';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.FILE]: FileInfo;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeFile {
  static getId(item: ExplorerItemData<FileInfo>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<FileInfo>): string {
    return item.payload.title;
  }

  static getMeta(item: ExplorerItemData<FileInfo>): string {
    return String(item.payload.id);
  }

  static getIcon(item: ExplorerItemData<FileInfo>): ReactNode {
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
