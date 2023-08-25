import React, { Component } from 'react';
import { observable, makeObservable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Restore, RestoreOutlined } from '@mui/icons-material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { updateLibraryRecord } from '../../../services/data/docLibrary/docLibrary.service';
import { LibraryRecord, LibraryRecordRaw } from '../../../services/data/docLibrary/docLibrary.models';
import { getPatch } from '../../../services/util/patch';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibraryDocumentVersionsActionsRestore = cn('LibraryDocumentVersionsActions', 'Restore');
const cnLibraryDocumentVersionsActionsRestoreDialog = cn('LibraryDocumentVersionsActionsRestore', 'Dialog');

interface LibraryDocumentVersionsActionsRestoreProps {
  documentVersion: LibraryRecordRaw;
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentVersionsActionsRestore extends Component<LibraryDocumentVersionsActionsRestoreProps> {
  @observable private dialogOpen = false;
  @observable private loading = false;

  constructor(props: LibraryDocumentVersionsActionsRestoreProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentVersionsActionsRestore()}
          title='Восстановить версию документа'
          as={as}
          onClick={this.openDialog}
          icon={this.dialogOpen ? <Restore /> : <RestoreOutlined />}
        />

        <Dialog
          className={cnLibraryDocumentVersionsActionsRestoreDialog()}
          open={this.dialogOpen}
          onClose={this.closeDialog}
        >
          <DialogTitle>Восстановить версию документа? </DialogTitle>
          <DialogActions>
            <Button onClick={this.updateDocument} loading={this.loading} color='primary'>
              Восстановить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
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

  @boundMethod
  private async updateDocument() {
    this.setLoading(true);
    const document = getPatch(this.props.documentVersion as LibraryRecord, this.props.document);

    delete document.role;
    delete document.libraryTableName;
    delete document.schemaId;

    try {
      await updateLibraryRecord(this.props.document, document);
    } catch (error) {
      const err = error as AxiosError<{ message?: string[] }>;

      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      }
    }

    this.setLoading(false);
    this.closeDialog();
  }
}
