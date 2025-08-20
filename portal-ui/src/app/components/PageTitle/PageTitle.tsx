import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./PageTitle.scss';

const cnPageTitle = cn('PageTitle');

export const PageTitle: FC<ChildrenProps> = ({ children }) => <h1 className={cnPageTitle()}>{children}</h1>;
