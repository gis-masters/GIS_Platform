import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './PrintMapImageControl-Image.scss';

const cnPrintMapImageControlImage = cn('PrintMapImageControl', 'Image');

export interface PrintMapImageControlImageProps {
  src: string;
}

export const PrintMapImageControlImage: FC<PrintMapImageControlImageProps> = ({ src }) => (
  <img className={cnPrintMapImageControlImage()} alt='' src={src} />
);
