import React, { ReactNode } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { FileTiff } from '../../../Icons/FileTiff';
import { staticImplements } from '../../../../services/util/staticImplements';
import { LibraryRecord } from '../../../../services/data/doc-library.service';
import { formatDate } from '../../../../services/util/date.util';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';

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

  static isFolder(): boolean {
    return false;
  }

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }) => <LibraryDocumentActions as='iconButton' hideOpen document={item.payload} />}
      </RegistryConsumer>
    );
  }
}
