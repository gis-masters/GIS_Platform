import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { MapLabels } from '../MapLabels/MapLabels';
import { MapMeasure } from '../MapMeasure/MapMeasure';
import { MapSelection } from '../MapSelection/MapSelection';
import { Search } from '../Search/Search';
import { ToolbarDivider } from '../ToolbarDivider/ToolbarDivider';
import { MapToolbarBar } from './Bar/MapToolbar-Bar';

import '!style-loader!css-loader!sass-loader!./MapToolbar.scss';

const cnMapToolbar = cn('MapToolbar');

const MapToolbar: FC = observer(() => (
  <div
    className={cnMapToolbar()}
    style={{
      '--MapToolbarLeftButtons': Number(mapStore.labelsVisible) * (6 + Number(mapStore.labels.length > 0))
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
