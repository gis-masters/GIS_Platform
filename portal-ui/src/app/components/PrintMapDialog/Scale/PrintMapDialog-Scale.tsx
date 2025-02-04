import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { getScaleLineImageSrc } from '../../../services/map/map-print.service';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Scale.scss';

const cnPrintMapDialogScale = cn('PrintMapDialog', 'Scale');

export const PrintMapDialogScale: FC = () => (
  <img className={cnPrintMapDialogScale()} src={getScaleLineImageSrc(72)} draggable={false} alt='' />
);
