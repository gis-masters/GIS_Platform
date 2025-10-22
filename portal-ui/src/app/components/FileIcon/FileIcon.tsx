import React, { type FC } from 'react';
import { type SvgIconProps } from '@mui/material';
import { InsertDriveFile, InsertDriveFileOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { normalizeExtension } from '../../services/data/files/files.util';

import './FileIcon.scss';

const cnFileIcon = cn('FileIcon');

interface FileIconProps extends IClassNameProps, SvgIconProps {
  ext: string;
  outlined?: boolean;
}

export const FileIcon: FC<FileIconProps> = ({
  ext,
  outlined,
  className,
  fontSize = 'medium',
  color = 'action',
  ...iconProps
}) => {
  const Icon = outlined ? InsertDriveFileOutlined : InsertDriveFile;

  return (
    <span className={cnFileIcon({ fontSize, outlined }, [className])}>
      <Icon {...iconProps} fontSize={fontSize} color={color} />
      <span className={cnFileIcon('Ext')}>{normalizeExtension(ext).slice(0, 3)}</span>
    </span>
  );
};
