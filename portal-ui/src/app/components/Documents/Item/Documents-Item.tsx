import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AssignmentOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { getLibrary, getLibraryRecord, LibraryRecord } from '../../../services/crg/doc-library.service';
import { LibraryDocument } from '../../LibraryDocument/LibraryDocument';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';
import { Loading } from '../../Loading/Loading';

import { DocumentsName } from '../Name/Documents-Name';
import { DocumentInfo } from '../Documents';
import { AxiosError } from 'axios';
import { Toast } from '../../Toast/Toast';
import { LibraryDocumentActions } from '../../LibraryDocumentActions/LibraryDocumentActions.composed';

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
  @observable private loading = false;
  @observable private dialogOpen = false;
  @observable private disabled = false;
  @observable private status: LookupStatusType = 'normal';
  @observable private errorText = '';
  @observable private document: LibraryRecord;

  render() {
    const { item, editable, numerous, multiple, onDelete } = this.props;

    return (
      <>
        <LookupItem className={cnDocumentsItem({ numerous })}>
          <LookupIcon>
            <AssignmentOutlined color={this.errorText ? 'error' : 'action'} />
          </LookupIcon>
          <DocumentsName item={item} disabled={this.disabled} numerous={numerous} onClick={this.open} />
          {editable && (numerous || multiple) && <LookupNameGap />}
          {this.status !== 'normal' && <LookupStatus status={this.status} statusText={this.errorText} />}
          {editable && (
            <LookupActions>
              <LookupDelete<DocumentInfo> item={item} onDelete={onDelete} />
            </LookupActions>
          )}
        </LookupItem>

        {this.document && (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog} fullWidth maxWidth='xl'>
            <DialogTitle>{this.document.title}</DialogTitle>
            <DialogContent>
              <LibraryDocument document={this.document} contentOnly />
            </DialogContent>
            <DialogActions>
              <LibraryDocumentActions
                document={this.document}
                as='button'
                hideOpen
                forDialog
                onDialogClose={this.closeDialog}
              />
            </DialogActions>
          </Dialog>
        )}

        <Loading visible={this.loading} global noBackdrop />
      </>
    );
  }

  @boundMethod
  private async open() {
    await this.load();
    this.openDialog();
  }

  private async load() {
    this.setLoading(true);
    const { item } = this.props;
    try {
      const library = await getLibrary(item.libraryId);
      const document = await getLibraryRecord(item.libraryId, item.id, library.schemaId);
      this.setDocument(document);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      Toast.warn(`Ошибка получения документа. ${err.response.data.message || err.message}`);
    }
    this.setLoading(false);
  }

  @action
  private setDocument(doc: LibraryRecord) {
    this.document = doc;
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
