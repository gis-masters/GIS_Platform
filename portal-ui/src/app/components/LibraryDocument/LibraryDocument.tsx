import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';
import moment from 'moment';

import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { docLibraryService, LibraryRecord } from '../../services/crg/doc-library.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { schemaService } from '../../services/crg/schema.service';
import { route } from '../../stores/Route.store';
import {
  getDocLibrariesRecordsUrl,
  getDocumentLibraryRecordRoleAssignmentUrl
} from '../../services/server-urls.service';
import { communicationService } from '../../services/communication.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { Role } from '../../services/crg/permissions.models';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import {
  AllowedDetails,
  ExplorerItemData,
  ExplorerItemEntityType,
  ExplorerItemType
} from '../Explorer/Explorer.models';
import { ActionIntegrationSed } from '../ActionIntegrationSed/ActionIntegrationSed';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { ActionDownload } from '../ActionDownload/ActionDownload';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { ActionDelete } from '../ActionDelete/ActionDelete';
import { services } from '../../services/services';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import { LibraryDocumentActionEdit } from './ActionEdit/LibraryDocument-ActionEdit';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

@observer
export class LibraryDocument extends Component {
  @observable private document: LibraryRecord;
  @observable private explorerItem: ExplorerItemData<LibraryRecord>;
  @observable private fields: PropertySchema<LibraryRecord>[];
  @observable private documentRoleAssignmentUrl: string;
  @observable private isDeleteAllowed: AllowedDetails;
  @observable private documentUrl: string;
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
    const actionDetailsDelete = {
      visible: true,
      itemTitle: this.document?.title,
      disabled: !(currentUser.isAdmin || this.document?.role === Role.OWNER),
      isDeleteAllowed: this.isDeleteAllowed,
      needConfirmation: true
    };
    const ActionDetailsIntegrationSed = {
      visible: true,
      disabled: !(currentUser.isAdmin || this.document?.role === Role.OWNER || this.document?.role === Role.CONTRIBUTOR)
    };
    const downloadAction = {
      url: `${this.documentUrl}/${this.document?.id}/inner_path/download`,
      fileName: `${this.document?.title}.${this.document?.type}`,
      visible: true
    };

    return (
      <div className={cnLibraryDocument()}>
        {!this.error && this.document && (
          <>
            <h1 className={cnLibraryDocument('Title')}>{this.document.title}</h1>

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

            {this.documentRoleAssignmentUrl && (
              <PermissionsWidget
                url={this.documentRoleAssignmentUrl}
                title={this.document.title}
                itemEntityType={ExplorerItemEntityType.DOCUMENT}
                disabled={!(currentUser.isAdmin || this.document.role === Role.OWNER)}
              />
            )}

            <div className={cnLibraryDocument('Actions')}>
              <LibraryDocumentActionEdit document={this.document} fields={this.fields} />
              <ActionDownload actionDetails={downloadAction} fullSizeButton />
              <ActionIntegrationSed item={this.document} actionDetails={ActionDetailsIntegrationSed} fullSizeButton />
              <ActionDelete
                item={this.explorerItem}
                actionDetails={actionDetailsDelete}
                isDeleteAllowed={this.isDeleteAllowed}
                fullSizeButton
              />
            </div>
          </>
        )}

        {this.error && (
          <EmptyListView text='Документ не найден'>
            <Button routerLink={'/data-management'}>Перейти на страницу управления данными</Button>
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
      await this.getDocumentUrl();
      await this.getDocumentPermissionUrl();
      await this.getDeleteAllowed();
    }

    this.setBusy(false);
  }

  private async fetchDocument() {
    const { libraryId, documentId } = route.params;

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const library = await docLibraryService.getLibrary(libraryId);
      const document = await docLibraryService.getDocLibrariesRecord(libraryId, documentId, library.schemaId);

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

  private async getDocumentUrl(): Promise<void> {
    const documentUrl = await getDocLibrariesRecordsUrl(this.document.libraryId);
    this.setDocumentUrl(documentUrl);
  }

  private async getDocumentPermissionUrl(): Promise<void> {
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(this.document.libraryId, this.document.id);
    this.setDocumentRoleAssignmentUrl(url);
  }

  private async getDeleteAllowed(): Promise<void> {
    const records = await docLibraryService.getDocLibrariesRecordRecords(this.document.libraryId, this.document.id);
    const deleteAllowed = {
      ok: !records._embedded?.records.length,
      errorMessage: records._embedded?.records.length
        ? 'Папка не является пустой. Для её удаления необходимо сперва удалить все элементы внутри.'
        : undefined
    };

    this.setIsDeleteAllowed(deleteAllowed);
  }

  @action.bound
  private setLibraryItem(item: LibraryRecord) {
    this.explorerItem = {
      payload: item,
      type: item.isFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT
    };

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
  private setDocumentUrl(url: string) {
    this.documentUrl = url;
  }

  @action.bound
  private setError() {
    this.error = true;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private setIsDeleteAllowed(isDeleteAllowed: AllowedDetails) {
    this.isDeleteAllowed = isDeleteAllowed;
  }
}
