import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Inner.scss';

const cnProjectCardInner = cn('ProjectCard', 'Inner');

export const ProjectCardInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectCardInner()}>{children}</div>
);
