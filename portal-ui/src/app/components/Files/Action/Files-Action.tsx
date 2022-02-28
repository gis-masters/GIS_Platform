import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-Action.scss';

const cnFilesAction = cn('Files', 'Action');

interface FilesActionProps {
  filled: boolean;
}

export const FilesAction: FC<FilesActionProps> = ({ children, filled }) => (
  <div className={cnFilesAction({ filled })}>{children}</div>
);
