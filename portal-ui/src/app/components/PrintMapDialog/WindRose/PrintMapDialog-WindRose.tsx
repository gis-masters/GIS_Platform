import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { getWindRoseImageSrc } from '../../../services/map/map-print.service';

import './PrintMapDialog-WindRose.scss';

const cnPrintMapDialogWindRose = cn('PrintMapDialog', 'WindRose');

export const PrintMapDialogWindRose: FC = () => (
  <img className={cnPrintMapDialogWindRose()} src={getWindRoseImageSrc(72)} draggable={false} alt='' />
);
