import React, { ReactNode } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { FileInfo } from '../../../../services/data/files/files.models';
import { getLibraryRecordFiles } from '../../../../services/data/files/files.util';
import { CommonDiRegistry } from '../../../../services/di-registry';
import { PageOptions } from '../../../../services/models';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { FileTiff } from '../../../Icons/FileTiff';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError
} from '../../Explorer.models';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

function assertExplorerItemDataTypeDocument(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.DOCUMENT] {
  if (item.type !== ExplorerItemType.DOCUMENT) {
    throw itemTypeError;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDocument(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeDocument(item);

    return item.payload.title || '';
  }

  static getDescription(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDocument(item);

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

  static getMeta = ExplorerAdapterTypeDocument.getId;

  static getIcon(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDocument(item);

    return item.payload.type === 'tif' ? <FileTiff color='primary' /> : <InsertDriveFile color='primary' />;
  }

  static isFolder(item: ExplorerItemData, store: ExplorerStore): boolean {
    assertExplorerItemDataTypeDocument(item);

    if (store.explorerRole === 'dm') {
      return false;
    }

    return !!getLibraryRecordFiles(item.payload).length;
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeDocument(item);

    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }: CommonDiRegistry) => (
          <LibraryDocumentActions as='iconButton' hideOpen document={item.payload} />
        )}
      </RegistryConsumer>
    );
  }

  static getChildren(item: ExplorerItemData, pageOptions: PageOptions): [ExplorerItemData[], number] {
    assertExplorerItemDataTypeDocument(item);

    const files: FileInfo[] = getLibraryRecordFiles(item.payload);
    const pagesCount = Math.ceil(files.length / pageOptions.pageSize);
    const pageStart =
      files.length > pageOptions.page * pageOptions.pageSize ? pageOptions.page * pageOptions.pageSize : 0;
    const pageEnd = pageStart + pageOptions.pageSize;

    return [files.slice(pageStart, pageEnd).map(payload => ({ type: ExplorerItemType.FILE, payload })), pagesCount];
  }

  static getChildById(item: ExplorerItemData, fileId: string): ExplorerItemData {
    assertExplorerItemDataTypeDocument(item);

    const files: FileInfo[] = getLibraryRecordFiles(item.payload);
    const payload = files.find(file => file.id === fileId);

    if (!payload) {
      throw new Error(`File with id ${fileId} not found`);
    }

    return { type: ExplorerItemType.FILE, payload };
  }

  static getChildrenWithParticularOne(
    item: ExplorerItemData,
    { page, ...options }: PageOptions,
    fileId: string
  ): [ExplorerItemData[], number, number] | undefined {
    assertExplorerItemDataTypeDocument(item);

    const files: FileInfo[] = getLibraryRecordFiles(item.payload);
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
