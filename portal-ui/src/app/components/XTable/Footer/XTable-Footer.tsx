import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Footer.scss';

const cnXTableFooter = cn('XTable', 'Footer');

export const XTableFooter: FC = ({ children }) => <div className={cnXTableFooter()}>{children}</div>;
