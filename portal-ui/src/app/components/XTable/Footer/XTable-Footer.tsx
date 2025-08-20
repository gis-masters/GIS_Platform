import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./XTable-Footer.scss';

const cnXTableFooter = cn('XTable', 'Footer');

export const XTableFooter: FC<ChildrenProps> = ({ children }) => <div className={cnXTableFooter()}>{children}</div>;
