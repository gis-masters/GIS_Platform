import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-Dash.scss';

const cnCustomStyleControlDash = cn('CustomStyleControl', 'Dash');

interface CustomStyleControlDashProps {
  length: number;
  nextGap: number;
}

export const CustomStyleControlDash: FC<CustomStyleControlDashProps> = ({ length, nextGap }) => (
  <div className={cnCustomStyleControlDash()} style={{ width: length, marginRight: nextGap }} />
);
