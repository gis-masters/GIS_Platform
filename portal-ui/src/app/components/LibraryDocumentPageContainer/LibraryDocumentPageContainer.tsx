import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { getLibrary, getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { communicationService } from '../../services/communication.service';
import { LibraryDocument } from '../LibraryDocument/LibraryDocument';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';
import { Link } from '../Link/Link';

const cnLibraryDocumentPageContainer = cn('LibraryDocumentPageContainer');

@observer
export class LibraryDocumentPageContainer extends Component {
  @observable private document: LibraryRecord;
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
    return (
      <div className={cnLibraryDocumentPageContainer()}>
        {!this.error && this.document && <LibraryDocument document={this.document} />}

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
    this.setBusy(false);
  }

  private async fetchDocument() {
    const libraryId = route.params.libraryId;
    const documentId = Number(route.params.documentId);

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const library = await getLibrary(libraryId);
      const document = await getLibraryRecord(libraryId, documentId, library.schemaId);

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

  @action.bound
  private setLibraryItem(item: LibraryRecord) {
    this.document = item;
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
