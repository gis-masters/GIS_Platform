import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './XTable-Footer.scss';

const cnXTableFooter = cn('XTable', 'Footer');

export const XTableFooter: FC<ChildrenProps> = ({ children }) => <div className={cnXTableFooter()}>{children}</div>;
