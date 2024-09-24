import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService, DataChangeEventDetail } from '../../../services/communication.service';
import { FileConnection, FileInfo } from '../../../services/data/files/files.models';
import { getFile, getFileConnections } from '../../../services/data/files/files.service';
import {
  getFileBaseName,
  getFileExtension,
  isDxfFile,
  isGmlFile,
  isPreviewAllowed,
  isTifFile
} from '../../../services/data/files/files.util';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { Button } from '../../Button/Button';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { FilesConnections } from '../Connections/Files-Connections';
import { FilesDownloadCompoundFile } from '../DownloadCompoundFile/Files-DownloadCompoundFile';
import { FilesIcon } from '../Icon/Files-Icon';
import { FilesName } from '../Name/Files-Name';
import { FilesPlacement } from '../Placement/Files-Placement';
import { FilesPreview } from '../Preview/Files-Preview';
import { FilesSignature } from '../Signature/Files-Signature';

const cnFilesItem = cn('Files', 'Item');

interface FilesItemProps {
  item: FileInfo;
  status: LookupStatusType | undefined;
  file: File | undefined;
  statusText: string | undefined;
  numerous: boolean;
  editable?: boolean;
  multiple?: boolean;
  document?: LibraryRecord;
  showPlaceAction?: boolean;
  showMainCompoundFileActions?: boolean;
  onDelete(item: FileInfo[]): void;
  onPreview(item: FileInfo): void;
}

@observer
export class FilesItem extends Component<FilesItemProps> {
  @observable private connections: FileConnection[] = [];
  @observable private currentFileId?: string;
  @observable private deleteDialogOpen = false;
  @observable private fileInfo?: FileInfo;
  private operationId: symbol | undefined;

  constructor(props: FilesItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    communicationService.fileConnectionsUpdated.on(async (e: CustomEvent<DataChangeEventDetail<FileInfo[]>>) => {
      if (e.detail.data.some(file => file.id === this.currentFileId)) {
        this.dropConnections();
        await this.fetchConnections();
      }
    }, this);
    await this.fetchConnections();
    await this.updateFileInfo();
  }

  async componentDidUpdate(prevProps: FilesItemProps) {
    if (this.props.item.id !== prevProps.item.id) {
      this.dropConnections();
      await this.fetchConnections();
    }

    await this.updateFileInfo();
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const {
      item,
      editable,
      status,
      file,
      statusText,
      numerous,
      multiple,
      document,
      showMainCompoundFileActions,
      showPlaceAction,
      onPreview
    } = this.props;
    const ext = getFileExtension(item.title);
    const baseName = getFileBaseName(item.title);
    const disabled = status ? ['loading', 'new', 'error'].includes(status) : undefined;
    const isFileConnected = !!this.connections?.length && showPlaceAction;
    const isFileCanBePlaced =
      (showMainCompoundFileActions && showPlaceAction) ||
      (!showMainCompoundFileActions && showPlaceAction && (isGmlFile(item) || isTifFile(item) || isDxfFile(item)));
    const signed = !!(item.signed || this.fileInfo?.signed);

    return (
      <>
        <LookupItem className={cnFilesItem({ numerous })}>
          <FilesIcon ext={ext} color={status === 'error' ? 'error' : 'action'} />
          <FilesName
            mainCompletedCompoundFile={showMainCompoundFileActions}
            item={item}
            baseName={baseName}
            ext={ext}
            disabled={disabled}
            status={status}
            file={file}
            numerous={numerous}
          />
          {(numerous || multiple) && <LookupNameGap />}
          {!!status && <LookupStatus status={status} statusText={statusText} />}
          <LookupActions>
            {isPreviewAllowed(item) && <FilesPreview item={item} onPreview={onPreview} />}

            {showMainCompoundFileActions && showPlaceAction && (
              <FilesDownloadCompoundFile item={item} signed={signed} />
            )}

            {!showMainCompoundFileActions && <FilesSignature id={item.id} title={item.title} signed={signed} />}

            {isFileConnected && <FilesConnections file={item} connections={this.connections} />}

            {isFileCanBePlaced && <FilesPlacement document={document} fileInfo={item} />}

            {((showMainCompoundFileActions && editable) || (!showMainCompoundFileActions && editable)) && (
              <LookupDelete
                tooltip={showMainCompoundFileActions ? 'Удалить набор файлов' : undefined}
                item={item}
                onDelete={this.handleDeleteButtonClick}
              />
            )}
          </LookupActions>
        </LookupItem>

        <Dialog open={this.deleteDialogOpen} onClose={this.closeDeleteDialog}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent className='scroll'>
            Файл {item.title} подключен в проекты:
            <ConnectionsToProjects type='list' connections={this.connections} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDelete} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDeleteDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private handleDeleteButtonClick(item: FileInfo) {
    if (this.connections?.length) {
      this.openDeleteDialog();
    } else {
      this.props.onDelete([item]);
    }
  }

  @boundMethod
  private handleDelete() {
    this.props.onDelete([this.props.item]);
  }

  private async fetchConnections() {
    const { id } = this.props.item;
    const operationId = Symbol();
    this.operationId = operationId;
    this.currentFileId = id;

    const documentConnections = await getFileConnections(id);
    if (documentConnections.length && this.currentFileId === id && this.operationId === operationId) {
      this.setConnections(documentConnections);
    }
  }

  private async updateFileInfo(): Promise<void> {
    const { showMainCompoundFileActions, showPlaceAction, item } = this.props;
    const { id, signed } = item;

    if (!signed && !showMainCompoundFileActions && showPlaceAction) {
      const fileInfo = await getFile(id);
      this.setFileInfo(fileInfo);
    }
  }

  @action
  private dropConnections() {
    this.connections = [];
  }

  @action
  private setFileInfo(fileInfo: FileInfo): void {
    this.fileInfo = fileInfo;
  }

  @action
  private setConnections(connections: FileConnection[]) {
    this.connections = connections;
  }

  @action.bound
  private openDeleteDialog() {
    this.deleteDialogOpen = true;
  }

  @action.bound
  private closeDeleteDialog() {
    this.deleteDialogOpen = false;
  }
}
