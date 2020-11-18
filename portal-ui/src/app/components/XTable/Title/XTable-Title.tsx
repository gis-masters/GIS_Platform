import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Title.scss';

const cnXTableTitle = cn('XTable', 'Title');

export const XTableTitle: FC = ({ children }) => <div className={cnXTableTitle()}>{children}</div>;
