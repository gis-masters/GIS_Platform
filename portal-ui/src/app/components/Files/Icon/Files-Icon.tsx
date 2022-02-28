import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FileIcon } from '../../Icons/FileIcon';

import '!style-loader!css-loader!sass-loader!./Files-Icon.scss';

const cnFilesIcon = cn('Files', 'Icon');

interface FilesIconProps {
  ext: string;
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export const FilesIcon: FC<FilesIconProps> = ({ /*ext,*/ color }) => (
  <FileIcon className={cnFilesIcon()} ext={''} color={color} outlined />
);
