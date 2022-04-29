import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Name.scss';

const cnProjectCardName = cn('ProjectCard', 'Name');

interface ProjectCardNameProps {
  children: ReactNode;
}

export const ProjectCardName: FC<ProjectCardNameProps> = ({ children }) => (
  <div className={cnProjectCardName()}>{children}</div>
);
