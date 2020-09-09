import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Add } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./ProjectCard-AddIcon.scss';

const cnProjectCardAddIcon = cn('ProjectCard', 'AddIcon');

export const ProjectCardAddIcon: FC = ({}) => <Add className={cnProjectCardAddIcon()} />;
