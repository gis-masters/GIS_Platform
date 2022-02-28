import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-Ext.scss';

const cnFilesExt = cn('Files', 'Ext');

export const FilesExt: FC = ({ children }) => <span className={cnFilesExt()}>{children}</span>;
