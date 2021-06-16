import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { getScaleLineImageSrc } from '../../../services/map/map-print.service';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Scale.scss';

const cnPrintDialogScale = cn('PrintDialog', 'Scale');

export const PrintDialogScale: FC = () => (
  <img className={cnPrintDialogScale()} src={getScaleLineImageSrc(72)} draggable={false} alt='' />
);
