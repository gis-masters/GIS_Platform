import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { getWindRoseImageSrc } from '../../../services/map/map-print.service';

import '!style-loader!css-loader!sass-loader!./PrintDialog-WindRose.scss';

const cnPrintDialogWindRose = cn('PrintDialog', 'WindRose');

export const PrintDialogWindRose: FC = () => (
  <img className={cnPrintDialogWindRose()} src={getWindRoseImageSrc(72)} draggable={false} alt='' />
);
