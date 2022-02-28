import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { getFileBaseName, getFileExtension } from '../../../services/files.util';
import { FileInfo } from '../../../services/files.service';

import { FileStatusType } from '../Files';
import { FilesName } from '../Name/Files-Name';
import { FilesIcon } from '../Icon/Files-Icon';
import { FilesDelete } from '../Delete/Files-Delete';
import { FilesStatus } from '../Status/Files-Status';
import { FilesNameGap } from '../NameGap/Files-NameGap';

import '!style-loader!css-loader!sass-loader!./Files-Item.scss';

const cnFilesItem = cn('Files', 'Item');

interface FilesItemProps {
  item: FileInfo;
  editable: boolean;
  status: FileStatusType | undefined;
  file: File | undefined;
  error: string | undefined;
  numerous: boolean;
  multiple: boolean;
  onDelete(item: FileInfo): void;
}

export const FilesItem: FC<FilesItemProps> = ({
  item,
  editable,
  status,
  file,
  error,
  numerous,
  multiple,
  onDelete
}) => {
  const ext = getFileExtension(item.title);
  const baseName = getFileBaseName(item.title);
  const disabled = ['loading', 'new', 'error'].includes(status);

  return (
    <div className={cnFilesItem({ numerous })}>
      <FilesIcon ext={ext} color={status === 'error' ? 'error' : 'action'} />
      <FilesName item={item} baseName={baseName} ext={ext} disabled={disabled} file={file} numerous={numerous} />
      {editable && (numerous || multiple) && <FilesNameGap />}
      {!!status && <FilesStatus status={status} error={error} />}
      {editable && <FilesDelete item={item} onDelete={onDelete} />}
    </div>
  );
};
