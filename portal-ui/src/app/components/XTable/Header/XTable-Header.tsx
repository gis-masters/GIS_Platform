import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Header.scss';

const cnXTableHeader = cn('XTable', 'Header');

export const XTableHeader: FC = ({ children }) => <div className={cnXTableHeader()}>{children}</div>;
