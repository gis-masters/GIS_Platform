import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { communicationService } from '../../services/communication.service';
import { LibraryRecord } from '../../services/data/library/library.models';
import { getLibraryRecord } from '../../services/data/library/library.service';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { LibraryDeletedDocumentActions } from '../LibraryDeletedDocumentActions/LibraryDeletedDocumentActions';
import { LibraryDocument } from '../LibraryDocument/LibraryDocument';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions';
import { Link } from '../Link/Link';
import { Loading } from '../Loading/Loading';
import { TextBadge } from '../TextBadge/TextBadge';

import '!style-loader!css-loader!sass-loader!./LibraryDocumentPageContainer.scss';

const cnLibraryDocumentPageContainer = cn('LibraryDocumentPageContainer');

@observer
export class LibraryDocumentPageContainer extends Component {
  @observable private document?: LibraryRecord;
  @observable private error?: string;
  @observable private busy = false;

  private operationId?: symbol;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
    communicationService.libraryRecordUpdated.on(this.init, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const TypeIcon = this.document?.is_folder ? FolderOutlined : InsertDriveFileOutlined;

    return (
      <div className={cnLibraryDocumentPageContainer()}>
        {!this.error && this.document && (
          <>
            <h1 className={cnLibraryDocumentPageContainer('Title')}>
              <TypeIcon color='primary' className={cnLibraryDocumentPageContainer('TypeIcon')} />
              {this.document.is_deleted ? (
                <span className={cnLibraryDocumentPageContainer('TitleDeleted')}>Документ удален </span>
              ) : (
                this.document.title
              )}
              {this.document.id && <TextBadge id={this.document.id} className={cnLibraryDocumentPageContainer('Id')} />}
            </h1>
            <LibraryDocument document={this.document} />
            {this.document.is_deleted ? (
              <LibraryDeletedDocumentActions
                className={cnLibraryDocumentPageContainer('Actions')}
                hideOpen
                document={this.document}
                as='button'
              />
            ) : (
              <LibraryDocumentActions
                className={cnLibraryDocumentPageContainer('Actions')}
                document={this.document}
                as='button'
                hideOpen
              />
            )}
          </>
        )}

        {this.error && (
          <EmptyListView text={this.error}>
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
    this.setBusy(false);
  }

  private async fetchDocument() {
    const libraryTableName = route.params.libraryTableName;
    const documentId = Number(route.params.documentId);

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const document = await getLibraryRecord(libraryTableName, documentId);

      if (this.operationId !== operationId) {
        return;
      }

      this.setLibraryItem(document);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      this.setBusy(false);

      this.setError(err?.response?.data?.message || err?.message || 'Не удалось открыть документ');

      services.logger.error('Не удалось открыть документ: ', err.message);
    }
  }

  @action.bound
  private setLibraryItem(item: LibraryRecord) {
    this.document = item;
  }

  @action.bound
  private setError(error: string) {
    this.error = error;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }
}
