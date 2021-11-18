import React, { ReactNode } from 'react';
import moment from 'moment';
import { InsertDriveFile, SaveOutlined } from '@mui/icons-material';

import { FileTiff } from '../../../Icons/FileTiff';
import { services } from '../../../../services/services';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { communicationService } from '../../../../services/communication.service';
import {
  getDocLibrariesRecordsUrl,
  getDocumentLibraryRecordRoleAssignmentUrl
} from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { PropertyType } from '../../../../services/crg/schema.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { docLibraryService, LibraryRecord } from '../../../../services/crg/doc-library.service';
import { convertSchema, getSchemaWithAppliedContentType } from '../../../../services/crg/schema.utils';
import { DocumentActionsWidget } from '../../../DocumentActionsWidget/DocumentActionsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { Toast } from '../../../Toast/Toast';

import { ActionType, Adapter, AllowedActions, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
import { ExplorerInfoDescTitle } from '../../InfoDescTitle/Explorer-InfoDescTitle';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { getPatch } from '../../../../services/util/patch';
import { TextBadge } from '../../../TextBadge/TextBadge';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.DOCUMENT]: { title: string };
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeDocument {
  static getId(item: ExplorerItemData<LibraryRecord>): string {
    return `${item.payload.libraryId}:${item.payload.id}`;
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
          <ExplorerInfoDescItem>
            <ExplorerInfoDescTitle>Дата создания:</ExplorerInfoDescTitle>
            {moment(createdAt).format('LL')}
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

  static async getWidgets(item: ExplorerItemData<LibraryRecord>): Promise<ReactNode> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.payload.libraryId, item.payload.id);
    const currentItem = await docLibraryService.getRecord(item.payload.libraryId, item.payload.id);
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(item.payload.schemaId),
      item.payload.content_type_id
    );
    const fields = convertSchema(oldSchema.properties).filter(
      ({ propertyType }) => propertyType !== PropertyType.BINARY
    );

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ExplorerInfoDescTitle>Карточка документа:</ExplorerInfoDescTitle>
          <ViewContentWidget fields={fields} data={item.payload} />
        </ExplorerInfoDescItem>

        <DocumentActionsWidget document={item.payload} />

        <PermissionsWidget
          url={url}
          title={item.payload.title}
          itemEntityType={ExplorerItemEntityType.DOCUMENT}
          disabled={!(currentUser.isAdmin || currentItem.role === Role.OWNER)}
        />
      </>
    );
  }

  static isFolder(): boolean {
    return false;
  }

  static async getAllowedActions(item: ExplorerItemData<LibraryRecord>): Promise<AllowedActions> {
    const binaryField = 'inner_path'; // temporary binary fieldName of default document library schema
    const recordsUrl = await getDocLibrariesRecordsUrl(item.payload.libraryId);
    const document = item.payload;
    const currentItem = await docLibraryService.getRecord(item.payload.libraryId, item.payload.id);
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(item.payload.schemaId),
      item.payload.content_type_id
    );
    const fields = convertSchema(oldSchema.properties).filter(
      ({ propertyType }) => propertyType !== PropertyType.BINARY
    );

    return {
      [ActionType.INTEGRATION_SED]: {
        visible: true
      },
      [ActionType.EDIT]: {
        visible: true,
        disabled: !(currentUser.isAdmin || currentItem.role === Role.OWNER || currentItem.role === Role.CONTRIBUTOR),
        fields,
        payload: item.payload,
        actionFunction: async (value: LibraryRecord) => {
          await docLibraryService.updateRecord(item.payload.libraryId, item.payload.id, getPatch(value, item.payload));
        },
        dialogTitle: (
          <>
            Редактирование документа
            <TextBadge id={item.payload.id} />
          </>
        ),
        actionButtonProps: { startIcon: <SaveOutlined />, children: 'Сохранить' }
      },

      [ActionType.DOWNLOAD]: {
        url: `${recordsUrl}/${document.id}/${binaryField}/download`,
        fileName: `${document.title}.${document.type}`,
        visible: true
      },

      [ActionType.DELETE]: {
        visible: true,
        disabled: !(currentUser.isAdmin || currentItem.role === Role.OWNER),
        itemTitle: item.payload.title,
        needConfirmation: true
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
