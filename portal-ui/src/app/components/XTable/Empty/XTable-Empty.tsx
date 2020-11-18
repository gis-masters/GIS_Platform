import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./XTable-Empty.scss';

const cnXTableEmpty = cn('XTable', 'Empty');

export const XTableEmpty: FC = () => <div className={cnXTableEmpty()}>Нет записей.</div>;
