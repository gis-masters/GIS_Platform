import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { mapLabelsStore } from '../../stores/MapLabels.store';
import { MapLabels } from '../MapLabels/MapLabels';
import { MapMeasure } from '../MapMeasure/MapMeasure';
import { MapSelection } from '../MapSelection/MapSelection';
import { MapSnapPixelTolerance } from '../MapSnapPixelTolerance/MapSnapPixelTolerance';
import { Search } from '../Search/Search';
import { ToolbarDivider } from '../ToolbarDivider/ToolbarDivider';
import { MapToolbarBar } from './Bar/MapToolbar-Bar';

import '!style-loader!css-loader!sass-loader!./MapToolbar.scss';

const cnMapToolbar = cn('MapToolbar');

const MapToolbar: FC = observer(() => (
  <>
    <div
      className={cnMapToolbar()}
      style={{
        '--MapToolbarLeftButtons': Number(mapLabelsStore.labelsVisible) * (6 + Number(mapLabelsStore.labels.length > 0))
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

    <MapSnapPixelTolerance />
  </>
));

export default MapToolbar;
