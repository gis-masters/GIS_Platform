import React, { ReactNode } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { staticImplements } from '../../../../services/util/staticImplements';
import { LibraryRecord } from '../../../../services/data/docLibrary/docLibrary.models';
import { getLibraryRecordFiles } from '../../../../services/data/files/files.util';
import { FileInfo } from '../../../../services/data/files/files.models';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { formatDate } from '../../../../services/util/date.util';
import { PageOptions } from '../../../../services/models';
import { FileTiff } from '../../../Icons/FileTiff';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerStore } from '../../Explorer.store';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT]: LibraryRecord;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>): ReactNode {
    const { details, created_at: createdAt } = item.payload;

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {formatDate(createdAt, 'LL')}
          </ExplorerInfoDescItem>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getIcon(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return item.payload.type === 'tif' ? <FileTiff color='primary' /> : <InsertDriveFile color='primary' />;
  }

  static isFolder(item: ExplorerItemData<LibraryRecord>, store: ExplorerStore): boolean {
    if (store.explorerRole === 'dm') {
      return false;
    }

    return !!getLibraryRecordFiles(item.payload).length;
  }

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }: CommonDiRegistry) => (
          <LibraryDocumentActions as='iconButton' hideOpen document={item.payload} />
        )}
      </RegistryConsumer>
    );
  }

  static getChildren(
    explorerItem: ExplorerItemData<LibraryRecord>,
    pageOptions: PageOptions
  ): [ExplorerItemData<FileInfo>[], number] {
    const files: FileInfo[] = getLibraryRecordFiles(explorerItem.payload);
    const pagesCount = Math.ceil(files.length / pageOptions.pageSize);
    const pageStart =
      files.length > pageOptions.page * pageOptions.pageSize ? pageOptions.page * pageOptions.pageSize : 0;
    const pageEnd = pageStart + pageOptions.pageSize;

    return [files.slice(pageStart, pageEnd).map(item => ({ type: ExplorerItemType.FILE, payload: item })), pagesCount];
  }

  static getChildById(explorerItem: ExplorerItemData<LibraryRecord>, fileId: string): ExplorerItemData<FileInfo> {
    const files: FileInfo[] = getLibraryRecordFiles(explorerItem.payload);

    return { type: ExplorerItemType.FILE, payload: files.find(file => file.id === fileId) };
  }

  static getChildrenWithParticularOne(
    explorerItem: ExplorerItemData<LibraryRecord>,
    { page, ...options }: PageOptions,
    fileId: string
  ): [ExplorerItemData<FileInfo>[], number, number] | undefined {
    const files: FileInfo[] = getLibraryRecordFiles(explorerItem.payload);
    const fileIndex = files.findIndex(file => file.id === fileId);
    const totalPages = Math.round(files.length / options.pageSize);
    const filePage = Math.round(fileIndex / options.pageSize);

    return [
      files
        .slice(filePage * options.pageSize, filePage * options.pageSize + options.pageSize)
        .map(item => ({ type: ExplorerItemType.FILE, payload: item })),
      totalPages,
      filePage
    ];
  }
}
