import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './ProjectFolder-Name.scss';

const cnProjectFolderName = cn('ProjectFolder', 'Name');

export const ProjectFolderName: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectFolderName()}>{children}</div>
);
