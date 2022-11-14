import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
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
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { deleteLibraryRecord, getLibraryRecords, LibraryRecord } from '../../../services/data/doc-library.service';
import { FileConnection, FileInfo, getFileConnections } from '../../../services/data/files.service';
import { PropertyType, Schema } from '../../../services/data/schema.models';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { Button } from '../../Button/Button';

import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';

const cnLibraryDocumentActionsDelete = cn('LibraryDocumentActions', 'Delete');

interface LibraryDocumentActionsDeleteProps {
  document: LibraryRecord;
  schema: Schema<LibraryRecord>;
  as: ActionsItemVariant;
  onDelete?(): void;
}

interface FilesConnections {
  fileTitle: string;
  connections: FileConnection[];
}

@observer
export class LibraryDocumentActionsDelete extends Component<LibraryDocumentActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private busy = false;
  @observable private deleteAllowed: boolean;
  @observable private btnLoading: boolean;
  @observable private errorMessage: string;
  @observable private connections?: FilesConnections[];

  constructor(props: LibraryDocumentActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document } = this.props;

    return (
      <>
        <ActionsItem
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

    const [records] = await getLibraryRecords(document.libraryId, document.schemaId, {
      page: 0,
      pageSize: 1,
      queryParams: { parent: document.id }
    });

    this.setDeleteAllowed(!records.length);
    await this.showFilesConnections();

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

  private async showFilesConnections() {
    const { document, schema } = this.props;

    const fileFields = schema.properties
      .map(property => {
        if (property.propertyType === PropertyType.FILE) {
          return property.name;
        }
      })
      .filter(Boolean);

    const fields = fileFields.map(field => {
      return document[field] as FileInfo[];
    });

    const connections: FilesConnections[] = [];

    for (const field of fields) {
      if (field?.length) {
        connections.push(
          ...(await Promise.all(
            field.map(async file => {
              return await this.fetchConnections(file, field);
            })
          ))
        );
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
  private setConnections(connections: FilesConnections[]) {
    this.connections = connections.filter(Boolean);
  }

  private async fetchConnections(currentFile: FileInfo, files: FileInfo[]) {
    const fileId = currentFile.id;
    const connections = await getFileConnections(fileId);
    if (connections.length && files.some(file => file.id === fileId)) {
      return { fileTitle: currentFile.title, connections };
    }
  }
}
