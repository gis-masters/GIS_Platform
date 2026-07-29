import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './BboxPreview-Image.scss';

const cnBboxPreview = cn('BboxPreview');

interface BboxPreviewImageProps {
  src: string;
}

export const BboxPreviewImage: FC<BboxPreviewImageProps> = ({ src }) => (
  <img src={src} alt='BBOX preview' className={cnBboxPreview('Image')} />
);
