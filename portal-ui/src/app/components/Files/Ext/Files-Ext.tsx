import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-Ext.scss';

const cnFilesExt = cn('Files', 'Ext');

interface FilesExtProps {
  children: ReactNode;
}

export const FilesExt: FC<FilesExtProps> = ({ children }) => <span className={cnFilesExt()}>{children}</span>;
