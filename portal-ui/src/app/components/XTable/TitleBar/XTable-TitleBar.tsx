import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./XTable-TitleBar.scss';

const cnXTableTitleBar = cn('XTable', 'TitleBar');

export const XTableTitleBar: FC<ChildrenProps> = ({ children }) => <div className={cnXTableTitleBar()}>{children}</div>;
