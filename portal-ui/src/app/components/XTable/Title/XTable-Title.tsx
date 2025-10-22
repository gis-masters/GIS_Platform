import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './XTable-Title.scss';

const cnXTableTitle = cn('XTable', 'Title');

export const XTableTitle: FC<ChildrenProps> = ({ children }) => <div className={cnXTableTitle()}>{children}</div>;
