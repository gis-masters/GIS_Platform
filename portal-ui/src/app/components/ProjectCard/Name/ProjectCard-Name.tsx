import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Name.scss';

const cnProjectCardName = cn('ProjectCard', 'Name');

export const ProjectCardName: FC = ({ children }) => <div className={cnProjectCardName()}>{children}</div>;
