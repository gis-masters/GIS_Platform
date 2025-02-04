import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Basemap } from '../../services/data/basemaps/basemaps.models';

import '!style-loader!css-loader!sass-loader!./BasemapDetails.scss';

const cnBasemapDetails = cn('BasemapDetails');

interface BasemapDetailsProps {
  basemap: Basemap;
}

export const BasemapDetails: FC<BasemapDetailsProps> = ({ basemap }) => (
  <div className={cnBasemapDetails()}>
    <img src={basemap.thumbnailUrn} alt='' className={cnBasemapDetails('Thumbnail')} />
  </div>
);
