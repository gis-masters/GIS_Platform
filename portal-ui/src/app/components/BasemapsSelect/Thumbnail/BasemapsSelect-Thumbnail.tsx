import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './BasemapsSelect-Thumbnail.scss';

const cnBasemapsSelectThumbnail = cn('BasemapsSelect', 'Thumbnail');

interface BasemapsSelectThumbnailProps {
  urn: string;
}

export const BasemapsSelectThumbnail: FC<BasemapsSelectThumbnailProps> = ({ urn }) => (
  <img className={cnBasemapsSelectThumbnail()} src={urn} />
);
