import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Projects-List.scss';

const cnProjectsList = cn('Projects', 'List');

interface ProjectsListProps {
  children: ReactNode;
}

export const ProjectsList: FC<ProjectsListProps> = ({ children }) => <div className={cnProjectsList()}>{children}</div>;
