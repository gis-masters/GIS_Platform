import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Inner.scss';

const cnProjectCardInner = cn('ProjectCard', 'Inner');

export const ProjectCardInner: FC = ({ children }) => <div className={cnProjectCardInner()}>{children}</div>;
