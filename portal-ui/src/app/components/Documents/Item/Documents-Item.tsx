import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AssignmentOutlined, FolderOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { getLibraryRecord } from '../../../services/data/docLibrary/docLibrary.service';
import { LibraryRecord } from '../../../services/data/docLibrary/docLibrary.models';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';

import { DocumentsName } from '../Name/Documents-Name';
import { DocumentInfo } from '../Documents';

const cnDocumentsItem = cn('Documents', 'Item');

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
  @observable private document: LibraryRecord;

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
        <LookupItem className={cnDocumentsItem({ numerous })}>
          <LookupIcon>
            <Icon color='action' />
          </LookupIcon>
          <DocumentsName
            item={item}
            disabled={this.status !== 'normal'}
            numerous={numerous}
            onClick={this.openDialog}
          />
          {editable && (numerous || multiple) && <LookupNameGap />}
          {this.status !== 'normal' && <LookupStatus status={this.status} statusText={this.statusText} />}
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
      const document = await getLibraryRecord(item.libraryTableName || item.libraryId, item.id);
      this.setDocument(document);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError?.response?.status === 403) {
        this.setStatus('forbidden', 'Ошибка доступа');
      } else {
        this.setStatus(
          'error',
          `Ошибка получения документа. ${axiosError?.response?.data?.message || axiosError?.message}`
        );
      }
    }
  }
}
