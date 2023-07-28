import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Search } from '../Search/Search';
import { MapMeasure } from '../MapMeasure/MapMeasure';
import { MapToolbarBar } from './Bar/MapToolbar-Bar';
import { MapSelection } from '../MapSelection/MapSelection';
import { ToolbarDivider } from '../ToolbarDivider/ToolbarDivider';
import { CancelSelection } from '../CancelSelection/CancelSelection';

import '!style-loader!css-loader!sass-loader!./MapToolbar.scss';

const cnMapToolbar = cn('MapToolbar');

export const MapToolbar: FC = () => (
  <div className={cnMapToolbar()}>
    <MapToolbarBar>
      <MapSelection />
      <CancelSelection />
      <ToolbarDivider />
      <MapMeasure />
    </MapToolbarBar>
    <Search />
  </div>
);
