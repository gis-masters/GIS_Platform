import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './ProjectCard-Inner.scss';

const cnProjectCardInner = cn('ProjectCard', 'Inner');

export const ProjectCardInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectCardInner()}>{children}</div>
);
