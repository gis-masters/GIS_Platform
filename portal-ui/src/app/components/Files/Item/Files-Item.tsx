import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { getFileBaseName, getFileExtension, isPreviewAllowed, isTifFile } from '../../../services/files.util';
import { FileInfo } from '../../../services/files.service';
import { LookupStatus, LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { LookupActions } from '../../Lookup/Actions/Lookup-Actions';
import { LookupItem } from '../../Lookup/Item/Lookup-Item';

import { FilesName } from '../Name/Files-Name';
import { FilesIcon } from '../Icon/Files-Icon';
import { LookupDelete } from '../../Lookup/Delete/Lookup-Delete';
import { LookupNameGap } from '../../Lookup/NameGap/Lookup-NameGap';
import { FilesPreview } from '../Preview/Files-Preview';
import { FilesConnections } from '../Connections/Files-Connections';

const cnFilesItem = cn('Files', 'Item');

interface FilesItemProps {
  item: FileInfo;
  editable: boolean;
  status: LookupStatusType | undefined;
  file: File | undefined;
  statusText: string | undefined;
  numerous: boolean;
  multiple: boolean;
  onDelete(item: FileInfo): void;
  onPreview(item: FileInfo): void;
}

export const FilesItem: FC<FilesItemProps> = ({
  item,
  editable,
  status,
  file,
  statusText,
  numerous,
  multiple,
  onDelete,
  onPreview
}) => {
  const ext = getFileExtension(item.title);
  const baseName = getFileBaseName(item.title);
  const disabled = ['loading', 'new', 'error'].includes(status);

  return (
    <LookupItem className={cnFilesItem({ numerous })}>
      <FilesIcon ext={ext} color={status === 'error' ? 'error' : 'action'} />
      <FilesName item={item} baseName={baseName} ext={ext} disabled={disabled} file={file} numerous={numerous} />
      {editable && (numerous || multiple) && <LookupNameGap />}
      {!!status && <LookupStatus status={status} statusText={statusText} />}
      {isPreviewAllowed(item) && <FilesPreview item={item} onPreview={onPreview} />}
      {isTifFile(item) && <FilesConnections fileId={item.id} />}
      {editable && (
        <LookupActions>
          <LookupDelete item={item} onDelete={onDelete} />
        </LookupActions>
      )}
    </LookupItem>
  );
};
