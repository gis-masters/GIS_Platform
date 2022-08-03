import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../services/server-urls.service';
import { applyContentType } from '../../services/data/schema.utils';
import { PropertyType, Schema } from '../../services/data/schema.models';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { LibraryRecord } from '../../services/data/doc-library.service';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { schemaService } from '../../services/data/schema.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { Role } from '../../services/data/permissions.models';
import { formatDate } from '../../services/util/date.util';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

interface LibraryDocumentProps {
  document?: LibraryRecord;
  contentOnly?: boolean;
}

@observer
export class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private schema: Schema<LibraryRecord>;
  @observable private documentRoleAssignmentUrl: string;

  constructor(props: LibraryDocumentProps) {
    super(props);
    makeObservable(this);
  }

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
              {this.schema && <ViewContentWidget schema={this.schema as Schema} data={document} />}
            </div>

            {!contentOnly && this.documentRoleAssignmentUrl && (
              <PermissionsWidget
                url={this.documentRoleAssignmentUrl}
                title={document.title}
                itemEntityType={ExplorerItemEntityTypeTitle.DOCUMENT}
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
    const schema = applyContentType(
      await schemaService.getSchema(this.props.document.schemaId),
      this.props.document.content_type_id
    );

    this.setSchema({
      ...schema,
      properties: schema.properties.filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    });
  }

  private async fetchDocumentPermissionUrl(): Promise<void> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(this.props.document.libraryId, this.props.document.id);
    this.setDocumentRoleAssignmentUrl(url);
  }

  @action.bound
  private setSchema(schema: Schema<LibraryRecord>) {
    this.schema = schema;
  }

  @action.bound
  private setDocumentRoleAssignmentUrl(url: string) {
    this.documentRoleAssignmentUrl = url;
  }
}
