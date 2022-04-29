import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Header.scss';

const cnXTableHeader = cn('XTable', 'Header');

interface XTableHeaderProps {
  children: ReactNode;
}

export const XTableHeader: FC<XTableHeaderProps> = ({ children }) => <div className={cnXTableHeader()}>{children}</div>;
