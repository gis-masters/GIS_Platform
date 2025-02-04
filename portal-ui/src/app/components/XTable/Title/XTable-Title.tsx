import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./XTable-Title.scss';

const cnXTableTitle = cn('XTable', 'Title');

export const XTableTitle: FC<ChildrenProps> = ({ children }) => <div className={cnXTableTitle()}>{children}</div>;
