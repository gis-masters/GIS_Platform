import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./TabInner.scss';

const cnTabInner = cn('TabInner');

export const TabInner: FC<ChildrenProps> = ({ children }) => <span className={cnTabInner()}>{children}</span>;
