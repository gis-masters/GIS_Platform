import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Count.scss';

const cnProjectCardCount = cn('ProjectCard', 'Count');

interface ProjectCardCountProps {
  count: number;
}

export const ProjectCardCount: FC<ProjectCardCountProps> = ({ count }) => (
  <div className={cnProjectCardCount()}>Слоёв загружено: {count}</div>
);
