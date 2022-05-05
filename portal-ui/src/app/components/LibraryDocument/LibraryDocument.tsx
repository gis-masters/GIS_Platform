import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { convertProperties, applyContentTypeOld } from '../../services/crg/schema.utils';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../services/server-urls.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { ExplorerItemEntityType } from '../Explorer/Explorer.models';
import { schemaService } from '../../services/crg/schema.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { Role } from '../../services/crg/permissions.models';
import { formatDate } from '../../services/util/date.util';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

interface LibraryDocumentProps {
  document?: LibraryRecord;
  contentOnly?: boolean;
}

@observer
export class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private fields: PropertySchema<LibraryRecord>[];
  @observable private documentRoleAssignmentUrl: string;

  async componentDidMount() {
    await this.fetchSchema();
    await this.fetchDocumentPermissionUrl();
  }

  render() {
    const { contentOnly, document } = this.props;

    return (
      <div className={cnLibraryDocument()}>
        {document && (
          <>
            {!contentOnly && <h1 className={cnLibraryDocument('Title')}>{document.title}</h1>}

            <div className={cnLibraryDocument('Date')}>
              <span className={cnLibraryDocument('DateTitle')}>Дата создания:</span>
              {formatDate(document.created_at, 'LL')}
            </div>

            <div className={cnLibraryDocument('DocumentCard')}>
              {this.fields && (
                <ViewContentWidget fields={this.fields as PropertySchema<Record<string, unknown>>[]} data={document} />
              )}
            </div>

            {!contentOnly && this.documentRoleAssignmentUrl && (
              <PermissionsWidget
                url={this.documentRoleAssignmentUrl}
                title={document.title}
                itemEntityType={ExplorerItemEntityType.DOCUMENT}
                disabled={!(currentUser.isAdmin || document.role === Role.OWNER)}
              />
            )}

            {!contentOnly && (
              <LibraryDocumentActions
                className={cnLibraryDocument('Actions')}
                document={document}
                as='button'
                hideOpen
              />
            )}
          </>
        )}
      </div>
    );
  }

  private async fetchSchema(): Promise<void> {
    const oldSchema = applyContentTypeOld(
      await schemaService.getOldSchema(this.props.document.schemaId),
      this.props.document.content_type_id
    );

    this.setFields(
      convertProperties(oldSchema.properties).filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    );
  }

  private async fetchDocumentPermissionUrl(): Promise<void> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(this.props.document.libraryId, this.props.document.id);
    this.setDocumentRoleAssignmentUrl(url);
  }

  @action.bound
  private setFields(fields: PropertySchema<LibraryRecord>[]) {
    this.fields = fields;
  }

  @action.bound
  private setDocumentRoleAssignmentUrl(url: string) {
    this.documentRoleAssignmentUrl = url;
  }
}
