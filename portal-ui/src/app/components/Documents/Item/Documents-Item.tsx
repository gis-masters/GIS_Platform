import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AssignmentOutlined, FolderOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { getLibraryRecord } from '../../../services/data/library/library.service';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { DocumentInfo } from '../Documents';
import { DocumentsName } from '../Name/Documents-Name';

import '!style-loader!css-loader!sass-loader!../Icon/Documents-Icon.scss';

const cnDocuments = cn('Documents');

interface DocumentsItemProps {
  item: DocumentInfo;
  editable: boolean;
  numerous: boolean;
  multiple: boolean;
  onDelete(item: DocumentInfo): void;
}

@observer
export class DocumentsItem extends Component<DocumentsItemProps> {
  @observable private dialogOpen = false;
  @observable private status: LookupStatusType = 'normal';
  @observable private statusText = '';
  @observable private document?: LibraryRecord;

  constructor(props: DocumentsItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.load();
  }

  render() {
    const { item, editable, numerous, multiple, onDelete } = this.props;
    const Icon = this.document?.is_folder ? FolderOutlined : AssignmentOutlined;

    return (
      <>
        <LookupItem className={cnDocuments('Item', { numerous })}>
          <LookupIcon>
            <Icon
              color='action'
              className={cnDocuments('Icon', { status: this.document?.is_deleted ? 'deleted' : undefined })}
            />
          </LookupIcon>
          <DocumentsName
            item={item}
            deleted={this.document?.is_deleted}
            disabled={this.status !== 'normal' && this.status !== 'deleted'}
            numerous={numerous}
            onClick={this.openDialog}
          />
          {editable && (numerous || multiple) && <LookupNameGap />}
          {(this.status !== 'normal' || this.document?.is_deleted) && (
            <LookupStatus status={this.status} statusText={this.statusText} />
          )}
          {editable && (
            <LookupActions>
              <LookupDelete<DocumentInfo> item={item} onDelete={onDelete} />
            </LookupActions>
          )}
        </LookupItem>

        {this.document && (
          <LibraryDocumentDialog document={this.document} open={this.dialogOpen} onClose={this.closeDialog} />
        )}
      </>
    );
  }

  @action
  private setDocument(doc: LibraryRecord) {
    this.document = doc;
  }

  @action
  private setStatus(status: LookupStatusType, statusText: string) {
    this.status = status;
    this.statusText = statusText;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  private async load() {
    const { item } = this.props;
    try {
      const libraryTableName = item.libraryTableName || item.libraryId;
      if (!libraryTableName) {
        throw new Error('Не указана библиотека документа');
      }
      const document = await getLibraryRecord(libraryTableName, item.id);
      this.setDocument(document);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError?.response?.status === 403) {
        this.setStatus('forbidden', 'Доступ ограничен');
      } else {
        this.setStatus(
          'error',
          `Ошибка получения документа. ${axiosError?.response?.data?.message || axiosError?.message}`
        );
      }
    }

    if (this.document?.is_deleted) {
      this.setStatus('deleted', 'Перемещен в корзину');
    }
  }
}
