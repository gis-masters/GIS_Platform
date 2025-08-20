import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
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
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { cryptoProStore } from '../../../stores/CryptoPro.store';
import { ConnectionsToProjects } from '../../ConnectionsToProjects/ConnectionsToProjects';
import { IconButton } from '../../IconButton/IconButton';
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
import { FilesSignDialog } from '../SignDialog/Files-SignDialog';

import '!style-loader!css-loader!sass-loader!../Sign/Files-Sign.scss';

const cnFilesItem = cn('Files', 'Item');
const cnFilesSign = cn('Files', 'Sign');

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
  fileInfo: FileInfo | null;
  fileSignDialogOpen: boolean;
  setFileSignDialogOpen(fileSignDialogOpen: boolean): void;
  setConnections(connections: FileConnection[]): void;
  setIds(id: string): void;
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

      fileInfo,
      fileSignDialogOpen,
      setFileSignDialogOpen,
      setConnections,
      setIds,

      setFileInfo
    } = useLocalObservable(
      (): FilesItemState => ({
        connections: [],
        id: item.id,
        fileInfo: null,
        fileSignDialogOpen: false,

        setFileSignDialogOpen(this: FilesItemState, fileSignDialogOpen: boolean): void {
          this.fileSignDialogOpen = fileSignDialogOpen;
        },
        setConnections(this: FilesItemState, connections: FileConnection[]): void {
          this.connections = connections;
        },
        setIds(this: FilesItemState, id: string): void {
          this.id = id;
        },
        setFileInfo(this: FilesItemState, fileInfo: FileInfo): void {
          this.fileInfo = fileInfo;
        }
      })
    );

    const handleDeleteButtonClick = useCallback(
      async (item: FileInfo) => {
        if (connections?.length) {
          const confirmed = await konfirmieren({
            message: (
              <>
                Файл {item.title} подключен в проекты:
                <ConnectionsToProjects type='list' connections={connections} />
              </>
            ),
            okText: 'Удалить',
            cancelText: 'Отмена'
          });

          if (confirmed) {
            onDelete([item]);
          }
        } else {
          onDelete([item]);
        }
      },
      [connections, onDelete]
    );

    const fileSignDialogOpenHandler = useCallback(() => {
      setFileSignDialogOpen(true);
    }, [setFileSignDialogOpen]);

    const fetchConnections = useCallback(async () => {
      const { id: newId, size } = item;

      if (!size) {
        return;
      }

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

    const showSign = (editFeatureStore.firstFeature && editable) || (document && !editable);
    const showFilesSignatureInExplorer =
      (showPlaceAction || showMainCompoundFileActions || showMainCompoundFileActions === undefined) && !editable;
    const showFileSignatureOnMap = editFeatureStore.firstFeature && signed;
    const showSignButton = cryptoProStore.isPluginActive && !signed && !!item.size && showSign;
    const showLookupDeleteButton =
      (showMainCompoundFileActions && editable) || (!showMainCompoundFileActions && editable);

    useEffect(() => {
      void (async () => {
        communicationService.libraryRecordUpdated.on(async (e: CustomEvent<DataChangeEventDetail<LibraryRecord>>) => {
          if (e.detail.data.id === document?.id) {
            await updateFileInfo();
          }
        }, this);

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

        // проверяем есть ли плагин криптопро
        try {
          if (cryptoProStore.isPluginActive) {
            return;
          }

          await isValidSystemSetup();
          cryptoProStore.setPluginActive();
        } catch {
          // do nothing
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
              <FilesSignature
                id={item.id}
                title={item.title}
                signed={signed}
                propertyName={propertyName}
                document={document}
                feature={editFeatureStore.firstFeature}
                updateFileInfo={updateFileInfo}
              />
            )}

            {showSignButton && (
              <Tooltip title={'Подписать ЭЦП'}>
                <span>
                  <IconButton onClick={fileSignDialogOpenHandler} className={cnFilesSign()} size='small'>
                    <WorkspacePremiumOutlined color='disabled' fontSize='small' />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {fileSignDialogOpen && (
              <FilesSignDialog
                id={item.id}
                title={item.title}
                propertyName={propertyName}
                document={document}
                feature={editFeatureStore.firstFeature}
                open={fileSignDialogOpen}
                onClose={setFileSignDialogOpen}
                updateFileInfo={updateFileInfo}
              />
            )}

            {showMainCompoundFileActions && showPlaceAction && (
              <FilesDownloadCompoundFile item={item} signed={signed} />
            )}

            {isFileConnected && <FilesConnections file={item} connections={connections} />}

            {isFileCanBePlaced && <FilesPlacement document={document} fileInfo={item} />}

            {showLookupDeleteButton && (
              <LookupDelete
                tooltip={showMainCompoundFileActions ? 'Удалить набор файлов' : undefined}
                item={item}
                onDelete={handleDeleteButtonClick}
              />
            )}
          </LookupActions>
        </LookupItem>
      </>
    );
  }
);

export const FilesItem = memo(FilesItemFC);
