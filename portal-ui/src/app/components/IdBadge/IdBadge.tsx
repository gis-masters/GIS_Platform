import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./IdBadge.scss';

const cnIdBadge = cn('IdBadge');

interface IdBadgeProps {
  id: string | number;
}

export const IdBadge: FC<IdBadgeProps> = ({ id }) => <Paper className={cnIdBadge()}>id: {id}</Paper>;
