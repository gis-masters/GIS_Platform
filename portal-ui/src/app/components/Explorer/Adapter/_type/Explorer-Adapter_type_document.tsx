import React, { ReactNode } from 'react';
import moment from 'moment';
import { InsertDriveFile } from '@mui/icons-material';

import { FileTiff } from '../../../Icons/FileTiff';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { PropertyType } from '../../../../services/crg/schema.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { getLibraryRecord, LibraryRecord } from '../../../../services/crg/doc-library.service';
import { LibraryDocumentActions } from '../../../LibraryDocumentActions/LibraryDocumentActions.composed';
import { convertSchema, getSchemaWithAppliedContentType } from '../../../../services/crg/schema.utils';
import { DocumentActionsWidget } from '../../../DocumentActionsWidget/DocumentActionsWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';

import { Adapter, ExplorerItemData, ExplorerItemEntityType } from '../../Explorer.models';
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
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id, item.payload.schemaId);
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

  static getActions(item: ExplorerItemData<LibraryRecord>): ReactNode {
    return <LibraryDocumentActions as='iconButton' hideOpen document={item.payload} />;
  }
}
