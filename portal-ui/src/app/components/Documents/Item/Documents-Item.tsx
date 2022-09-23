import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AssignmentOutlined, FolderOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { getLibraryRecord, LibraryRecord } from '../../../services/data/doc-library.service';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';
import { Loading } from '../../Loading/Loading';
import { Toast } from '../../Toast/Toast';

import { DocumentsName } from '../Name/Documents-Name';
import { DocumentInfo } from '../Documents';

import '!style-loader!css-loader!sass-loader!../Dialog/Documents-Dialog.scss';

const cnDocumentsItem = cn('Documents', 'Item');
const cnDocumentsDialog = cn('DocumentsDialog');

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

  constructor(props: DocumentsItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    await this.load();
  }

  render() {
    const { item, editable, numerous, multiple, onDelete } = this.props;

    return (
      <>
        <LookupItem className={cnDocumentsItem({ numerous })}>
          <LookupIcon>
            {this.document?.is_folder ? (
              <FolderOutlined color={this.errorText ? 'error' : 'action'} />
            ) : (
              <AssignmentOutlined color={this.errorText ? 'error' : 'action'} />
            )}
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
            <DialogTitle className={cnDocumentsDialog('Title')}>
              <div className={cnDocumentsDialog('TypeIcon')}>
                {this.document?.is_folder ? (
                  <FolderOutlined color='primary' />
                ) : (
                  <InsertDriveFileOutlined color='primary' />
                )}
              </div>
              {this.document.title}
            </DialogTitle>

            <DialogContent>
              <RegistryConsumer id='common'>
                {({ LibraryDocument }) => <LibraryDocument document={this.document} contentOnly />}
              </RegistryConsumer>
            </DialogContent>
            <DialogActions>
              <RegistryConsumer id='common'>
                {({ LibraryDocumentActions }) => (
                  <LibraryDocumentActions
                    document={this.document}
                    as='button'
                    hideOpen
                    forDialog
                    onDialogClose={this.closeDialog}
                  />
                )}
              </RegistryConsumer>
            </DialogActions>
          </Dialog>
        )}

        <Loading visible={this.loading} global noBackdrop />
      </>
    );
  }

  @action
  private setDocument(doc: LibraryRecord) {
    this.document = doc;
  }

  @action
  private openDialog() {
    this.dialogOpen = true;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
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
      const document = await getLibraryRecord(item.libraryId, item.id);
      this.setDocument(document);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      Toast.warn(`Ошибка получения документа. ${err.response.data.message || err.message}`);
    }
    this.setLoading(false);
  }
}
