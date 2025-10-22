import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../services/models';

import './TabInner.scss';

const cnTabInner = cn('TabInner');

export const TabInner: FC<ChildrenProps> = ({ children }) => <span className={cnTabInner()}>{children}</span>;
