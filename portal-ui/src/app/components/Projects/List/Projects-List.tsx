import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Projects-List.scss';

const cnProjectsList = cn('Projects', 'List');
export const ProjectsList: FC<ChildrenProps> = ({ children }) => <div className={cnProjectsList()}>{children}</div>;
