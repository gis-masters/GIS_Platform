import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-NameGap.scss';

const cnFilesNameGap = cn('Files', 'NameGap');

export const FilesNameGap: FC = ({ children }) => <div className={cnFilesNameGap()}>{children}</div>;
