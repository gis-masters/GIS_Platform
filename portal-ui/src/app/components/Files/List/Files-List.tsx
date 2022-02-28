import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-List.scss';

const cnFilesList = cn('Files', 'List');

interface FilesListProps {
  multiple: boolean;
  numerous: boolean;
  editable: boolean;
}

export const FilesList: FC<FilesListProps> = ({ multiple, numerous, editable, children }) => (
  <div className={cnFilesList({ multiple, numerous, editable }, ['scroll'])}>{children}</div>
);
