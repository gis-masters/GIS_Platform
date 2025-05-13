import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Name.scss';

const cnProjectFolderName = cn('ProjectFolder', 'Name');

export const ProjectFolderName: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectFolderName()}>{children}</div>
);
