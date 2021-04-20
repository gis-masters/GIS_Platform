import React from 'react';
import moment from 'moment';
import { InsertDriveFile } from '@material-ui/icons';

import { LibraryItem } from '../../../../services/crg/doc-library.service';
import { staticImplements } from '../../../../services/util/staticImplements';

import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData<LibraryItem>) {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryItem>) {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryItem>) {
    const { details, created_at } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {created_at ? (
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(created_at).format('LL')}
          </p>
        ) : null}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<LibraryItem>) {
    return String(item.payload.id);
  }

  static getIcon() {
    return <InsertDriveFile color='primary' />;
  }

  static isFolder() {
    return false;
  }
}
