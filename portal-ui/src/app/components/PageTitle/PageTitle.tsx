import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../services/models';

import './PageTitle.scss';

const cnPageTitle = cn('PageTitle');

export const PageTitle: FC<ChildrenProps> = ({ children }) => <h1 className={cnPageTitle()}>{children}</h1>;
