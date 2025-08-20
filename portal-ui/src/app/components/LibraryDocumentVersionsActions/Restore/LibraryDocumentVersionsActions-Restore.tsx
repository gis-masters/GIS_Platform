import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Restore, RestoreOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { LibraryRecord, LibraryRecordRaw } from '../../../services/data/library/library.models';
import { updateLibraryRecord } from '../../../services/data/library/library.service';
import { getPatch } from '../../../services/util/patch';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';

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

    if (!Object.keys(document).length) {
      Toast.info('Документ уже соответствует выбранной версии');

      this.setLoading(false);
      this.closeDialog();

      return;
    }

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
