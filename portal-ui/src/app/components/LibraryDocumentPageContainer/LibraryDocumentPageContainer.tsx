import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { getLibraryRecord, LibraryRecord } from '../../services/data/doc-library.service';
import { communicationService } from '../../services/communication.service';
import { LibraryDocument } from '../LibraryDocument/LibraryDocument';
import { EmptyListView } from '../EmptyListView/EmptyListView';
import { services } from '../../services/services';
import { route } from '../../stores/Route.store';
import { Loading } from '../Loading/Loading';
import { Link } from '../Link/Link';

const cnLibraryDocumentPageContainer = cn('LibraryDocumentPageContainer');

@observer
export class LibraryDocumentPageContainer extends Component {
  @observable private document: LibraryRecord;
  @observable private error: string;
  @observable private busy = false;

  private operationId?: symbol;

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

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
    const libraryId = route.params.libraryId;
    const documentId = Number(route.params.documentId);

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const document = await getLibraryRecord(libraryId, documentId);

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
