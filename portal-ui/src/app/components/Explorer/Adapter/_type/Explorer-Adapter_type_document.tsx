import React, { ReactNode } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { RegistryConsumer } from '@bem-react/di';

import { FileTiff } from '../../../Icons/FileTiff';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { Role } from '../../../../services/crg/permissions.models';
import { schemaService } from '../../../../services/crg/schema.service';
import { getLibraryRecord, LibraryRecord } from '../../../../services/crg/doc-library.service';
import { applyContentType } from '../../../../services/crg/schema.utils';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { formatDate } from '../../../../services/util/date.util';

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

  static async getWidgets(item: ExplorerItemData<LibraryRecord>): Promise<ReactNode> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(item.payload.libraryId, item.payload.id);
    const currentItem = await getLibraryRecord(item.payload.libraryId, item.payload.id);
    const schema = applyContentType(await schemaService.getSchema(item.payload.schemaId), item.payload.content_type_id);

    return (
      <>
        <ExplorerInfoDescItem multiline>
          <ViewContentWidget schema={schema} data={item.payload} />
        </ExplorerInfoDescItem>

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
    return (
      <RegistryConsumer id='common'>
        {({ LibraryDocumentActions }) => <LibraryDocumentActions as='iconButton' hideOpen document={item.payload} />}
      </RegistryConsumer>
    );
  }
}
