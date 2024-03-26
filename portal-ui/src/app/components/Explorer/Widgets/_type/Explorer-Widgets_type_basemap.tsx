import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { ExplorerItemType } from '../../Explorer.models';
import { ConnectionsBasemapToProjectsWidget } from '../../../ConnectionsBasemapToProjectsWidget/ConnectionsBasemapToProjectsWidget';
import { BasemapDetails } from '../../../BasemapDetails/BasemapDetails';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { assertExplorerItemDataTypeBasemap } from '../../Adapter/_type/Explorer-Adapter_type_basemap';

const ExplorerWidgetsTypeBasemap: FC<ExplorerWidgetsProps> = observer(({ className, item }) => {
  assertExplorerItemDataTypeBasemap(item);

  return (
    <div className={cnExplorerWidgets(null, [className])}>
      <BasemapDetails basemap={item.payload} />
      <ConnectionsBasemapToProjectsWidget basemap={item.payload} />
    </div>
  );
});

export const withTypeBasemap = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.BASEMAP },
  () => ExplorerWidgetsTypeBasemap
);
