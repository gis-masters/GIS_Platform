import React, { ReactNode } from 'react';
import { Restore } from '@mui/icons-material';

import { DocumentVersionExtended, LibraryRecord } from '../../../../services/data/library/library.models';
import { getDocumentVersions } from '../../../../services/data/library/library.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { usersService } from '../../../../services/auth/users/users.service';
import { PageOptions } from '../../../../services/models';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT_VERSIONS_ROOT]: LibraryRecord;
  }
}

@staticImplements<Adapter<LibraryRecord, DocumentVersionExtended>>()
export class ExplorerAdapterTypeDocumentVersionsRoot {
  static getId(): string {
    return 'documentVersionsRoot';
  }

  static getTitle(): string {
    return 'Версии документа';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <Restore color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData<LibraryRecord>,
    pageOptions: PageOptions
  ): Promise<[ExplorerItemData<DocumentVersionExtended>[], number]> {
    const response = await getDocumentVersions(item.payload.libraryTableName, item.payload.id);
    const documentVersions = await Promise.all(
      response.map(async version => {
        const content = version as DocumentVersionExtended;
        const user = await usersService.getUser(version.updatedBy);
        content.updatedByUser = `${user.middleName || ''} ${user.name} ${user.surname}`;
        content.document = item.payload;

        return {
          type: ExplorerItemType.DOCUMENT_VERSION,
          payload: content
        };
      })
    );

    const pagesCount = Math.ceil(documentVersions.length / pageOptions.pageSize);
    const pageStart =
      documentVersions.length > pageOptions.page * pageOptions.pageSize ? pageOptions.page * pageOptions.pageSize : 0;
    const pageEnd = pageStart + pageOptions.pageSize;

    documentVersions.reverse();

    return [documentVersions.slice(pageStart, pageEnd), pagesCount];
  }
}
