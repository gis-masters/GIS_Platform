import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Inner.scss';

const cnProjectFolderInner = cn('ProjectFolder', 'Inner');

export const ProjectFolderInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectFolderInner()}>{children}</div>
);
