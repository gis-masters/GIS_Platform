import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./BaseMapsSelect-Thumbnail.scss';

const cnBaseMapsSelectThumbnail = cn('BaseMapsSelect', 'Thumbnail');

interface BaseMapsSelectThumbnailProps {
  urn: string;
}

export const BaseMapsSelectThumbnail: FC<BaseMapsSelectThumbnailProps> = ({ urn }) => (
  <img className={cnBaseMapsSelectThumbnail()} src={urn} />
);
