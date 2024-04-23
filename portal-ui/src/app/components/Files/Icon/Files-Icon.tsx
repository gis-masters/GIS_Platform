import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FileIcon } from '../../FileIcon/FileIcon';
import { LookupIcon } from '../../Lookup/Icon/Lookup-Icon';

const cnFilesIcon = cn('Files', 'Icon');

interface FilesIconProps {
  ext: string;
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const FilesIcon: FC<FilesIconProps> = ({ ext, color }) => (
  <LookupIcon className={cnFilesIcon()}>
    <FileIcon ext={ext} color={color} outlined />
  </LookupIcon>
);
