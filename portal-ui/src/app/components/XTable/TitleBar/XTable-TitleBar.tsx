import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './XTable-TitleBar.scss';

const cnXTableTitleBar = cn('XTable', 'TitleBar');

export const XTableTitleBar: FC<ChildrenProps> = ({ children }) => <div className={cnXTableTitleBar()}>{children}</div>;
