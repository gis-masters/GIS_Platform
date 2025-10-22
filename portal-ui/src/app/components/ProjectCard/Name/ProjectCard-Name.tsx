import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './ProjectCard-Name.scss';

const cnProjectCardName = cn('ProjectCard', 'Name');

export const ProjectCardName: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectCardName()}>{children}</div>
);
