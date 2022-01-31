import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import moment from 'moment';

import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { getLibrary, getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { schemaService } from '../../services/crg/schema.service';
import { route } from '../../stores/Route.store';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../services/server-urls.service';
import { communicationService } from '../../services/communication.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { Role } from '../../services/crg/permissions.models';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { ExplorerItemEntityType } from '../Explorer/Explorer.models';
import { services } from '../../services/services';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';
import { Link } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

export interface LibraryDocumentProps {
  document?: LibraryRecord;
  contentOnly?: boolean;
}

@observer
export class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private document: LibraryRecord;
  @observable private fields: PropertySchema<LibraryRecord>[];
  @observable private documentRoleAssignmentUrl: string;
  @observable private error: boolean;
  @observable private busy = false;
  private operationId?: symbol;

  async componentDidMount() {
    await this.init();
    communicationService.libraryItemsUpdated.on(this.init, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    moment.locale('ru');
    const { contentOnly } = this.props;

    return (
      <div className={cnLibraryDocument()}>
        {!this.error && this.document && (
          <>
            {!contentOnly && <h1 className={cnLibraryDocument('Title')}>{this.document.title}</h1>}

            <div className={cnLibraryDocument('Date')}>
              <span className={cnLibraryDocument('DateTitle')}>Дата создания:</span>
              {moment(this.document.created_at).format('LL')}
            </div>

            <div className={cnLibraryDocument('DocumentCard')}>
              {this.fields && (
                <ViewContentWidget
                  fields={this.fields as PropertySchema<Record<string, unknown>>[]}
                  data={this.document}
                />
              )}
            </div>

            {!contentOnly && this.documentRoleAssignmentUrl && (
              <PermissionsWidget
                url={this.documentRoleAssignmentUrl}
                title={this.document.title}
                itemEntityType={ExplorerItemEntityType.DOCUMENT}
                disabled={!(currentUser.isAdmin || this.document.role === Role.OWNER)}
              />
            )}

            {!contentOnly && (
              <LibraryDocumentActions
                className={cnLibraryDocument('Actions')}
                document={this.document}
                as='button'
                hideOpen
              />
            )}
          </>
        )}

        {this.error && (
          <EmptyListView text='Документ не найден'>
            <Link href={'/data-management'}>На страницу управления данными</Link>
          </EmptyListView>
        )}

        <Loading visible={this.busy} />
      </div>
    );
  }

  @boundMethod
  private async init() {
    this.setBusy(true);
    await this.fetchDocument();
    if (!this.error) {
      await this.getSchema();
      await this.getDocumentPermissionUrl();
    }

    this.setBusy(false);
  }

  private async fetchDocument() {
    if (this.props.document) {
      this.setLibraryItem(this.props.document);

      return;
    }

    const { libraryId, documentId } = route.params;

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const library = await getLibrary(libraryId);
      const document = await getLibraryRecord(libraryId, Number(documentId), library.schemaId);

      if (this.operationId !== operationId) {
        return;
      }

      this.setLibraryItem(document);
    } catch (error) {
      const err = error as AxiosError;
      this.setError();
      this.setBusy(false);
      Toast.error({
        message: err.message,
        canBeSuppressed: true
      });
      services.logger.error('Не удалось открыть документ: ', err.message);
    }
  }

  private async getSchema(): Promise<void> {
    const oldSchema = getSchemaWithAppliedContentType(
      await schemaService.getSchema(this.document.schemaId),
      this.document.content_type_id
    );

    this.setFields(
      convertSchema(oldSchema.properties).filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    );
  }

  private async getDocumentPermissionUrl(): Promise<void> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(this.document.libraryId, this.document.id);
    this.setDocumentRoleAssignmentUrl(url);
  }

  @action.bound
  private setLibraryItem(item: LibraryRecord) {
    this.document = item;
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
  private setError() {
    this.error = true;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
