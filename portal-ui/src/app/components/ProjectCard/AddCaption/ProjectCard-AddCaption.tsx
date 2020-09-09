import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ProjectCard-AddCaption.scss';

const cnProjectCardAddCaption = cn('ProjectCard', 'AddCaption');

export const ProjectCardAddCaption: FC = () => <div className={cnProjectCardAddCaption()}>Создать новый проект</div>;
