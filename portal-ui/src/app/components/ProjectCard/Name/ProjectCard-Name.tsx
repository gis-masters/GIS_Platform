import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Name.scss';

const cnProjectCardName = cn('ProjectCard', 'Name');

export const ProjectCardName: FC<ChildrenProps> = ({ children }) => (
  <div className={cnProjectCardName()}>{children}</div>
);
