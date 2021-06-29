import React, { ReactNode } from 'react';
import moment from 'moment';
import { InsertDriveFile } from '@material-ui/icons';

import { Toast } from '../../../Toast/Toast';
import { services } from '../../../../services/services';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { docLibraryService, LibraryRecord } from '../../../../services/crg/doc-library.service';
import { communicationService } from '../../../../services/communication.service';

import { Adapter, AllowedActions, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { getDocLibrariesRecordsUrl } from '../../../../services/server-urls.service';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return `${item.type}:${item.payload.id}`;
  }

  static getTitle(item: ExplorerItemData<LibraryRecord>): string {
    return item.payload.title;
  }

  static getDescription(item: ExplorerItemData<LibraryRecord>): ReactNode {
    const { details, created_at: createdAt } = item.payload;
    moment.locale('ru');

    return (
      <>
        {details && <p>{details}</p>}

        {createdAt && (
          <p>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
          </p>
        )}
      </>
    );
  }

  static getMeta(item: ExplorerItemData<LibraryRecord>): string {
    return String(item.payload.id);
  }

  static getIcon(): ReactNode {
    return <InsertDriveFile color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }

  static async getAllowedActions(item: ExplorerItemData<LibraryRecord>): Promise<AllowedActions> {
    const deletionAllowed = currentUser.isAdmin;
    const field = 'inner_path'; // temporary binary fieldName of default document library schema
    const recordsUrl = await getDocLibrariesRecordsUrl('documents');
    const document = item.payload;

    return {
      delete: {
        visible: true,
        disabled: !deletionAllowed,
        needConfirmation: true,
        confirmationText: 'Вы действительно хотите удалить файл?'
      },
      download: {
        url: `${recordsUrl}/${document.id}/${field}/download`,
        fileName: `${document.title}.${document.type}`,
        visible: true
      }
    };
  }

  static async deleteItem(item: ExplorerItemData<LibraryRecord>): Promise<void> {
    const { id, libraryId } = item.payload;

    try {
      await docLibraryService.deleteRecord(libraryId, id);

      communicationService.libraryItemsUpdated.emit();
    } catch (error) {
      Toast.error('Не удалось удалить файл');
      services.logger.error('Не удалось удалить файл: ', error);
    }
  }
}
