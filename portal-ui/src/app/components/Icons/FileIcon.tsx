import React, { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import { InsertDriveFile, InsertDriveFileOutlined } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./FileIcon.scss';

const cnFileIcon = cn('FileIcon');

interface FileIconProps extends IClassNameProps, SvgIconProps {
  ext: string;
  outlined?: boolean;
}

export const FileIcon: FC<FileIconProps> = ({ ext, outlined, className, fontSize = 'medium', ...iconProps }) => {
  const Icon = outlined ? InsertDriveFileOutlined : InsertDriveFile;

  return (
    <span className={cnFileIcon({ fontSize, outlined }, [className])}>
      <Icon {...iconProps} fontSize={fontSize} />
      <span className={cnFileIcon('Ext')}>{ext}</span>
    </span>
  );
};
