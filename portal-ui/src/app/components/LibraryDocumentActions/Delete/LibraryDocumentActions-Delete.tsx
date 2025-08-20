import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List
} from '@mui/material';
import { Delete, DeleteOutline, ExpandMore } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { FileConnection } from '../../../services/data/files/files.models';
import { getFileConnections } from '../../../services/data/files/files.service';
import { getLibraryRecordFiles } from '../../../services/data/files/files.util';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { deleteLibraryRecord, getLibraryRecords } from '../../../services/data/library/library.service';
import { Schema } from '../../../services/data/schema/schema.models';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Button } from '../../Button/Button';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';

const cnLibraryDocumentActionsDelete = cn('LibraryDocumentActions', 'Delete');
const cnLibraryDocumentActionsDeleteDialog = cn('LibraryDocumentActions', 'DeleteDialog');

interface LibraryDocumentActionsDeleteProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
  disabled?: boolean;
  onDelete?(): void;
}

interface FileConnections {
  fileTitle: string;
  connections: FileConnection[];
}

@observer
export class LibraryDocumentActionsDelete extends Component<LibraryDocumentActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private busy = false;
  @observable private deleteAllowed = false;
  @observable private btnLoading = false;
  @observable private errorMessage = '';
  @observable private connections?: FileConnections[];

  constructor(props: LibraryDocumentActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, disabled } = this.props;
    const role = document.role;

    if (!role) {
      return;
    }

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsDelete()}
          title='Удалить'
          tooltipText={disabled ? getAvailableActionsTooltipByRole(ActionTypes.DELETE, role, DataTypes.DOC) : undefined}
          color='error'
          as={as}
          onClick={this.openDialog}
          disabled={this.busy || disabled}
          icon={this.dialogOpen ? <Delete /> : <DeleteOutline />}
        />

        {this.busy || Boolean(this.deleteAllowed) ? (
          <Dialog open={this.dialogOpen} onClose={this.closeDialog} className={cnLibraryDocumentActionsDeleteDialog()}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent className='scroll'>
              <DialogContentText>Вы действительно хотите удалить "{document.title}"?</DialogContentText>

              {!!this.connections?.length && (
                <>
                  <br />В документе присутствуют связи файлов с проектами:
                  <List>
                    {this.connections.map((connection, index: number) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>{connection?.fileTitle}</AccordionSummary>
                        <AccordionDetails>
                          <ConnectionsToProjects type='list' connections={connection.connections} />
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </List>
                </>
              )}
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

    const [records] = await getLibraryRecords(document.libraryTableName, {
      page: 0,
      pageSize: 1,
      queryParams: { parent: document.id }
    });

    this.setDeleteAllowed(!records.length);
    await this.showFilesConnections();

    this.setErrorMessage(
      records.length ? 'Раздел не пустой. Для его удаления необходимо сперва удалить все элементы внутри.' : ''
    );
  }

  @boundMethod
  private async doDeletion() {
    const { document, onDelete } = this.props;

    this.setBtnLoading(true);
    await deleteLibraryRecord(document);
    this.setErrorMessage('');
    this.setDeleteAllowed(false);
    this.setBtnLoading(false);
    this.closeDialog();
    if (onDelete) {
      onDelete();
    }
  }

  private async showFilesConnections() {
    const { document } = this.props;
    const connections: FileConnections[] = [];

    for (const file of getLibraryRecordFiles(document)) {
      const fileConnections = await getFileConnections(file.id);
      if (fileConnections.length) {
        connections.push({ fileTitle: file.title, connections: fileConnections });
      }
    }

    this.setConnections(connections);
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

  @action
  private setConnections(connections: FileConnections[]) {
    this.connections = connections.filter(notFalsyFilter);
  }
}
