import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { MapSelectionCancel } from './Cancel/MapSelection-Cancel';
import { MapSelectionSelect } from './Select/MapSelection-Select';

import '!style-loader!css-loader!sass-loader!./MapSelection.scss';

const cnMapSelection = cn('MapSelection');

export const MapSelection: FC = () => (
  <div className={cnMapSelection()}>
    <MapSelectionSelect />
    <MapSelectionCancel />
  </div>
);
