import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Footer.scss';

const cnProjectCardFooter = cn('ProjectCard', 'Footer');

export const ProjectCardFooter: FC = () => <div className={cnProjectCardFooter()}>Открыть</div>;
