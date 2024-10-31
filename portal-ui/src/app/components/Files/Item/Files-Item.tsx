import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { isValidSystemSetup } from 'crypto-pro';

import { communicationService, DataChangeEventDetail } from '../../../services/communication.service';
import { FileConnection, FileInfo } from '../../../services/data/files/files.models';
import { getFileConnections, getFileInfo } from '../../../services/data/files/files.service';
import {
  getFileBaseName,
  getFileExtension,
  isDxfFile,
  isGmlFile,
  isPreviewAllowed,
  isTifFile
} from '../../../services/data/files/files.util';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { sidebars } from '../../../stores/Sidebars.store';
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
import { FilesSign } from '../Sign/Files-Sign';
import { FilesSignature } from '../Signature/Files-Signature';

const cnFilesItem = cn('Files', 'Item');

interface FilesItemProps {
  item: FileInfo;
  status: LookupStatusType | undefined;
  file: File | undefined;
  statusText: string | undefined;
  numerous: boolean;
  propertyName?: string;
  editable?: boolean;
  multiple?: boolean;
  document?: LibraryRecord;
  showPlaceAction?: boolean;
  showMainCompoundFileActions?: boolean;
  onDelete(item: FileInfo[]): void;
  onPreview(item: FileInfo): void;
}

type FilesItemState = {
  connections: FileConnection[];
  id: string;
  deleteDialogOpen: boolean;
  fileInfo: FileInfo | null;
  isPluginActive: boolean;
  setIsPluginActive(isPluginActive: boolean): void;
  setConnections(connections: FileConnection[]): void;
  setIds(id: string): void;
  setDeleteDialogOpen(isOpen: boolean): void;
  setFileInfo(fileInfo: FileInfo): void;
};

const FilesItemFC: FC<FilesItemProps> = observer(
  ({
    item,
    editable,
    status,
    file,
    statusText,
    numerous,
    multiple,
    document,
    propertyName,
    showMainCompoundFileActions,
    showPlaceAction,
    onPreview,
    onDelete
  }) => {
    const {
      connections,
      id,
      deleteDialogOpen,
      fileInfo,
      isPluginActive,
      setIsPluginActive,
      setConnections,
      setIds,
      setDeleteDialogOpen,
      setFileInfo
    } = useLocalObservable(
      (): FilesItemState => ({
        connections: [],
        id: item.id,
        deleteDialogOpen: false,
        fileInfo: null,
        isPluginActive: false,

        setIsPluginActive(this: FilesItemState, isPluginActive: boolean): void {
          this.isPluginActive = isPluginActive;
        },
        setConnections(this: FilesItemState, connections: FileConnection[]): void {
          this.connections = connections;
        },
        setIds(this: FilesItemState, id: string): void {
          this.id = id;
        },
        setDeleteDialogOpen(this: FilesItemState, isOpen: boolean): void {
          this.deleteDialogOpen = isOpen;
        },
        setFileInfo(this: FilesItemState, fileInfo: FileInfo): void {
          this.fileInfo = fileInfo;
        }
      })
    );

    const handleDelete = useCallback(() => {
      onDelete([item]);
    }, [item, onDelete]);

    const openDeleteDialog = useCallback(() => {
      setDeleteDialogOpen(true);
    }, [setDeleteDialogOpen]);

    const handleDeleteButtonClick = useCallback(
      (item: FileInfo) => {
        if (connections?.length) {
          openDeleteDialog();
        } else {
          onDelete([item]);
        }
      },
      [connections?.length, onDelete, openDeleteDialog]
    );

    const closeDeleteDialog = useCallback(() => {
      setDeleteDialogOpen(false);
    }, [setDeleteDialogOpen]);

    const fetchConnections = useCallback(async () => {
      const { id: newId } = item;

      setIds(newId);

      const documentConnections = await getFileConnections(newId);

      if (documentConnections.length && id === newId) {
        setConnections(documentConnections);
      }
    }, [id, item, setConnections, setIds]);

    const dropConnections = useCallback(() => {
      setConnections([]);
    }, [setConnections]);

    const updateFileInfo = useCallback(async () => {
      const { id } = item;

      if (!status || status === 'success' || status === 'normal') {
        const fileInfo = await getFileInfo(id);

        setFileInfo(fileInfo);
      }
    }, [item, setFileInfo, status]);

    const { ext, baseName, disabled, isFileConnected, isFileCanBePlaced, signed } = useMemo(() => {
      const ext = getFileExtension(item.title);
      const baseName = getFileBaseName(item.title);
      const disabled = status ? ['loading', 'new', 'error'].includes(status) : undefined;
      const isFileConnected = !!connections?.length && showPlaceAction;
      const isFileCanBePlaced =
        (showMainCompoundFileActions && showPlaceAction) ||
        (!showMainCompoundFileActions && showPlaceAction && (isGmlFile(item) || isTifFile(item) || isDxfFile(item)));
      const signed = !!(item.signed || fileInfo?.signed);

      return { ext, baseName, disabled, isFileConnected, isFileCanBePlaced, signed };
    }, [connections, fileInfo?.signed, item, showMainCompoundFileActions, showPlaceAction, status]);

    const showSign = (sidebars.editFeaturesData?.features[0] && editable) || (document && !editable);
    const showFilesSignatureInExplorer =
      (showPlaceAction || showMainCompoundFileActions || showMainCompoundFileActions === undefined) && !editable;
    const showFileSignatureOnMap = sidebars.editFeaturesData?.features[0] && signed;

    useEffect(() => {
      void (async () => {
        communicationService.fileConnectionsUpdated.on(async (e: CustomEvent<DataChangeEventDetail<FileInfo[]>>) => {
          if (e.detail.data.some(file => file.id === id)) {
            dropConnections();
            await fetchConnections();
          }
        }, this);
        await fetchConnections();
        if (!item.signed) {
          await updateFileInfo();
        }
      })();
    }, []);

    useEffect(() => {
      void (async () => {
        dropConnections();
        await fetchConnections();

        if (!fileInfo && !item.signed) {
          await updateFileInfo();
        }

        // проверяем не отвалился ли плагин при работе с файлами
        if (await isValidSystemSetup()) {
          setIsPluginActive(true);
        }
      })();
    }, [item.id, item.signed, fileInfo]);

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

            {(showFilesSignatureInExplorer || showFileSignatureOnMap) && (
              <FilesSignature id={item.id} title={item.title} signed={signed} />
            )}

            {isPluginActive && !signed && showSign && (
              <FilesSign
                id={item.id}
                title={item.title}
                propertyName={propertyName}
                document={document}
                feature={sidebars.editFeaturesData?.features[0]}
                updateFileInfo={updateFileInfo}
              />
            )}

            {showMainCompoundFileActions && showPlaceAction && (
              <FilesDownloadCompoundFile item={item} signed={signed} />
            )}

            {isFileConnected && <FilesConnections file={item} connections={connections} />}

            {isFileCanBePlaced && <FilesPlacement document={document} fileInfo={item} />}

            {((showMainCompoundFileActions && editable) || (!showMainCompoundFileActions && editable)) && (
              <LookupDelete
                tooltip={showMainCompoundFileActions ? 'Удалить набор файлов' : undefined}
                item={item}
                onDelete={handleDeleteButtonClick}
              />
            )}
          </LookupActions>
        </LookupItem>

        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent className='scroll'>
            Файл {item.title} подключен в проекты:
            <ConnectionsToProjects type='list' connections={connections} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} color='primary'>
              Удалить
            </Button>
            <Button onClick={closeDeleteDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export const FilesItem = memo(FilesItemFC);
