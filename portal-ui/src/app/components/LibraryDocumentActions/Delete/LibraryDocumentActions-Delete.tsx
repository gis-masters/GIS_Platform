import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { deleteLibraryRecord, getLibraryRecords, LibraryRecord } from '../../../services/crg/doc-library.service';
import { PropertySchema } from '../../../services/crg/schema.models';
import { Button } from '../../Button/Button';

import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';

const cnLibraryDocumentActionsDelete = cn('LibraryDocumentActions', 'Edit');

interface LibraryDocumentActionsDeleteProps {
  document: LibraryRecord;
  fields: PropertySchema<LibraryRecord>[];
  as: ActionsItemVariant;
  onDelete?(): void;
}

@observer
export class LibraryDocumentActionsDelete extends Component<LibraryDocumentActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private busy = false;
  @observable private deleteAllowed: boolean;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;

  render() {
    const { as, document } = this.props;

    return (
      <>
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsDelete()}
          title='Удалить'
          color='error'
          as={as}
          onClick={this.openDialog}
          disabled={this.busy}
          icon={this.dialogOpen ? <Delete /> : <DeleteOutline />}
        />

        {this.busy || Boolean(this.deleteAllowed) ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <DialogContentText>Вы действительно хотите удалить "{document.title}"?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button loading={this.btnLoading} onClick={this.doDeletion} color='primary'>
                Удалить
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
            <DialogTitle>Невозможно удалить</DialogTitle>
            <DialogContent>
              <DialogContentText>{this.errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog}>Понятно</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
    void this.testEmptiness();
  }

  @boundMethod
  private async testEmptiness() {
    const { document } = this.props;

    const [records] = await getLibraryRecords(document.libraryId, document.schemaId, {
      page: 0,
      pageSize: 1,
      queryParams: { parent: document.id }
    });

    this.setDeleteAllowed(!records.length);
    this.setErrorMessage(
      records.length ? 'Раздел не пустой. Для его удаления необходимо сперва удалить все элементы внутри.' : undefined
    );
  }

  @boundMethod
  private async doDeletion() {
    const { document, onDelete } = this.props;

    this.setBtnLoading(true);
    await deleteLibraryRecord(document.libraryId, document.id);
    this.setErrorMessage('');
    this.setDeleteAllowed(false);
    this.setBtnLoading(false);
    this.closeDialog();
    if (onDelete) {
      onDelete();
    }
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;

    this.setBusy(false);
    this.setBtnLoading(false);
  }

  @action.bound
  private setBtnLoading(load: boolean) {
    this.btnLoading = load;
  }

  @action.bound
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action.bound
  private setErrorMessage(message: string) {
    this.errorMessage = message;
  }

  @action.bound
  private setDeleteAllowed(allowed: boolean) {
    this.deleteAllowed = allowed;
  }
}
