import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CardTyp } from '../ProjectCard';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Inner.scss';

const cnProjectCardInner = cn('ProjectCard', 'Inner');

interface ProjectCardInnerProps {
  typ: CardTyp;
}

export const ProjectCardInner: FC<ProjectCardInnerProps> = ({ typ, children }) => (
  <div className={cnProjectCardInner({ typ })}>{children}</div>
);
