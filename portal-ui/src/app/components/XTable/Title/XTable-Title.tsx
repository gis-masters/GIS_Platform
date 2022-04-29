import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Title.scss';

const cnXTableTitle = cn('XTable', 'Title');

interface XTableTitleProps {
  children: ReactNode;
}

export const XTableTitle: FC<XTableTitleProps> = ({ children }) => <div className={cnXTableTitle()}>{children}</div>;
