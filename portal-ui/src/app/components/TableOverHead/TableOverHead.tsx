import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./TableOverHead.scss';

const cnTableOverHead = cn('TableOverHead');

export const TableOverHead: FC = ({ children }) => <div className={cnTableOverHead()}>{children}</div>;
