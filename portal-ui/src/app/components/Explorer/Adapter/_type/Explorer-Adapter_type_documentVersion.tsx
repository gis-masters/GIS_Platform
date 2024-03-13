import React, { ReactNode } from 'react';
import { Restore } from '@mui/icons-material';

import { LibraryDocumentVersionsActions } from '../../../LibraryDocumentVersionsActions/LibraryDocumentVersionsActions';
import { DocumentVersionExtended } from '../../../../services/data/library/library.models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData } from '../../Explorer.models';

@staticImplements<Adapter<DocumentVersionExtended>>()
export class ExplorerAdapterTypeDocumentVersion {
  static getId(item: ExplorerItemData<DocumentVersionExtended>): string {
    return item.payload.updatedTime;
  }

  static getTitle(item: ExplorerItemData<DocumentVersionExtended>): string {
    return item.payload.updatedByUser;
  }

  static getMeta(item: ExplorerItemData<DocumentVersionExtended>): string {
    return formatDate(item.payload.updatedTime, 'HH:mm DD.MM.YYYY');
  }

  static getIcon(): ReactNode {
    return <Restore color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<DocumentVersionExtended>): ReactNode {
    return (
      <LibraryDocumentVersionsActions
        as='iconButton'
        document={item.payload.document}
        documentVersion={item.payload.content}
      />
    );
  }
}
