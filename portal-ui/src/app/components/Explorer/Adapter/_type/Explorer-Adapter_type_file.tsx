import React, { ReactNode } from 'react';
import { InsertDriveFile } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { FileInfo } from '../../../../services/data/files.service';
import { isTifFile } from '../../../../services/data/files.util';
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
    return isTifFile(item.payload) ? <FileTiff color='primary' /> : <InsertDriveFile color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }
}
