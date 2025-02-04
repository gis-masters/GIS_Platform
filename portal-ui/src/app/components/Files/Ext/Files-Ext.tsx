import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Files-Ext.scss';

const cnFilesExt = cn('Files', 'Ext');

export const FilesExt: FC<ChildrenProps> = ({ children }) => <span className={cnFilesExt()}>{children}</span>;
