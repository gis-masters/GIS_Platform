import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import {
  getFileBaseName,
  getFileExtension,
  isDxfFile,
  isGmlFile,
  isPreviewAllowed,
  isTifFile
} from '../../../services/data/files/files.util';
import { getFileConnections } from '../../../services/data/files/files.service';
import { FileConnection, FileInfo } from '../../../services/data/files/files.models';
import { communicationService, DataChangeEventDetail } from '../../../services/communication.service';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';
import { Button } from '../../Button/Button';

import { FilesName } from '../Name/Files-Name';
import { FilesIcon } from '../Icon/Files-Icon';
import { FilesPreview } from '../Preview/Files-Preview';
import { FilesConnections } from '../Connections/Files-Connections';
import { FilesPlacement } from '../Placement/Files-Placement';
import { FilesDownloadCompoundFile } from '../DownloadCompoundFile/Files-DownloadCompoundFile';

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
  private operationId: symbol | undefined;

  constructor(props: FilesItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    if (isTifFile(this.props.item)) {
      communicationService.fileConnectionsUpdated.on(async (e: CustomEvent<DataChangeEventDetail<FileInfo[]>>) => {
        if (e.detail.data.some(file => file.id === this.currentFileId)) {
          this.dropConnections();
          await this.fetchConnections();
        }
      }, this);
      await this.fetchConnections();
    }
  }

  async componentDidUpdate(prevProps: FilesItemProps) {
    if (isTifFile(this.props.item) && this.props.item.id !== prevProps.item.id) {
      this.dropConnections();
      await this.fetchConnections();
    }
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
            {showMainCompoundFileActions && showPlaceAction && <FilesDownloadCompoundFile item={item} />}

            {isFileConnected && <FilesConnections file={item} connections={this.connections} />}

            {isFileCanBePlaced && <FilesPlacement document={document} fileInfo={item} />}

            {((showMainCompoundFileActions && editable) || (!showMainCompoundFileActions && editable)) && (
              <LookupDelete
                tooltip={showMainCompoundFileActions ? 'Удалить набор файлов' : undefined}
                item={item}
                onDelete={this.deleteButtonClickHandler}
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
            <Button onClick={this.deleteHandler} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDeleteDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private deleteButtonClickHandler(item: FileInfo) {
    if (this.connections?.length) {
      this.openDeleteDialog();
    } else {
      this.props.onDelete([item]);
    }
  }

  @boundMethod
  private deleteHandler() {
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

  @action
  private dropConnections() {
    this.connections = [];
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
