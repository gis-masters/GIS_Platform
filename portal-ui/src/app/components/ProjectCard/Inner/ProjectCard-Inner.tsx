import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Inner.scss';

const cnProjectCardInner = cn('ProjectCard', 'Inner');

interface ProjectCardInnerProps {
  children: ReactNode;
}

export const ProjectCardInner: FC<ProjectCardInnerProps> = ({ children }) => (
  <div className={cnProjectCardInner()}>{children}</div>
);
