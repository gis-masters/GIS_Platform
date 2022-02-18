import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../services/server-urls.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { communicationService } from '../../services/communication.service';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { LibraryRecord } from '../../services/crg/doc-library.service';
import { ExplorerItemEntityType } from '../Explorer/Explorer.models';
import { schemaService } from '../../services/crg/schema.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { Role } from '../../services/crg/permissions.models';
import { Loading } from '../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

export interface LibraryDocumentProps {
  document?: LibraryRecord;
  contentOnly?: boolean;
}

@observer
export class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private fields: PropertySchema<LibraryRecord>[];
  @observable private documentRoleAssignmentUrl: string;
  @observable private error: boolean;
  @observable private busy = false;

  async componentDidMount() {
    await this.init();
    communicationService.libraryItemsUpdated.on(this.init, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    moment.locale('ru');
    const { contentOnly, document } = this.props;

    return (
      <div className={cnLibraryDocument()}>
        {!this.error && document && (
          <>
            {!contentOnly && <h1 className={cnLibraryDocument('Title')}>{document.title}</h1>}

            <div className={cnLibraryDocument('Date')}>
              <span className={cnLibraryDocument('DateTitle')}>Дата создания:</span>
              {moment(document.created_at).format('LL')}
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

        <Loading visible={this.busy} />
      </div>
    );
  }

  @boundMethod
  private async init() {
    this.setBusy(true);
    if (!this.error) {
      await this.getSchema();
      await this.getDocumentPermissionUrl();
    }

    this.setBusy(false);
  }

  private async getSchema(): Promise<void> {
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(this.props.document.schemaId),
      this.props.document.content_type_id
    );

    this.setFields(
      convertSchema(oldSchema.properties).filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    );
  }

  private async getDocumentPermissionUrl(): Promise<void> {
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

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
