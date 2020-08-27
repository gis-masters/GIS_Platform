import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./TableUnderFooter.scss';

const cnTableUnderFooter = cn('TableUnderFooter');

export const TableUnderFooter: FC = ({ children }) => <div className={cnTableUnderFooter()}>{children}</div>;
