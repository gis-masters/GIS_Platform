import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './ProjectFolder-Inner.scss';

const cnProjectFolderInner = cn('ProjectFolder', 'Inner');

export const ProjectFolderInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectFolderInner()}>{children}</div>
);
