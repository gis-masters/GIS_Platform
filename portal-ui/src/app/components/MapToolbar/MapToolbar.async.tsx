import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { ToolbarDivider } from '../ToolbarDivider/ToolbarDivider';
import { MapSelection } from '../MapSelection/MapSelection';
import { MapMeasure } from '../MapMeasure/MapMeasure';
import { MapLabels } from '../MapLabels/MapLabels';
import { Search } from '../Search/Search';

import { MapToolbarBar } from './Bar/MapToolbar-Bar';

import '!style-loader!css-loader!sass-loader!./MapToolbar.scss';

const cnMapToolbar = cn('MapToolbar');

const MapToolbar: FC = observer(() => (
  <div
    className={cnMapToolbar()}
    style={{
      '--MapToolbarLeftButtons': Number(mapStore.labelsVisible) * (2 + Number(mapStore.labels.length > 0))
    }}
  >
    <MapToolbarBar>
      <MapLabels />
      <ToolbarDivider />
      <MapSelection />
      <ToolbarDivider />
      <MapMeasure />
    </MapToolbarBar>
    <Search />
  </div>
));

export default MapToolbar;
