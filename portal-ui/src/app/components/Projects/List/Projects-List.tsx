import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Projects-List.scss';

const cnProjectsList = cn('Projects', 'List');
export const ProjectsList: FC<ChildrenProps> = ({ children }) => <div className={cnProjectsList()}>{children}</div>;
