import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { Basemap } from '../../../../services/data/basemaps.models';
import { ConnectionsBasemapToProjectsWidget } from '../../../ConnectionsBasemapToProjectsWidget/ConnectionsBasemapToProjectsWidget';
import { BasemapDetails } from '../../../BasemapDetails/BasemapDetails';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';

const ExplorerWidgetsTypeBasemap: FC<ExplorerWidgetsProps> = observer(({ className, item }) => {
  const { payload } = item as ExplorerItemData<Basemap>;

  return (
    <div className={cnExplorerWidgets(null, [className])}>
      <BasemapDetails basemap={payload} />
      <ConnectionsBasemapToProjectsWidget basemap={payload} />
    </div>
  );
});

export const withTypeBasemap = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.BASEMAP },
  () => ExplorerWidgetsTypeBasemap
);
