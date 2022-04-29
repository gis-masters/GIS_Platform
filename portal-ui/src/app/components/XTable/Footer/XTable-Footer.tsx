import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Footer.scss';

const cnXTableFooter = cn('XTable', 'Footer');

interface XTableFooterProps {
  children: ReactNode;
}

export const XTableFooter: FC<XTableFooterProps> = ({ children }) => <div className={cnXTableFooter()}>{children}</div>;
