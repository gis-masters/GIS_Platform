import React from 'react';
import { withBemMod } from '@bem-react/core';

import { Basemap } from '../../../../services/crg/basemaps.models';

import { ConnectionsBasemapToProjectsWidget } from '../../../ConnectionsBasemapToProjectsWidget/ConnectionsBasemapToProjectsWidget';
import { BasemapDetails } from '../../../BasemapDetails/BasemapDetails';

import { ExplorerItemType } from '../../Explorer.models';
import { cnExplorerInfo, ExplorerInfoProps } from '../Explorer-Info';

interface ExplorerInfoTypeBasemapProps {
  type?: ExplorerItemType;
}

function renderContent({ Explorer, store }: ExplorerInfoProps) {
  const { selectedItem } = store;
  const basemap = selectedItem.payload as Basemap;

  return (
    <>
      <BasemapDetails basemap={basemap} />
      <ConnectionsBasemapToProjectsWidget Explorer={Explorer} basemap={basemap} />
    </>
  );
}

export const withExplorerInfoTypeBasemap = withBemMod<ExplorerInfoTypeBasemapProps, ExplorerInfoProps>(
  cnExplorerInfo(),
  { type: ExplorerItemType.BASEMAP },
  ExplorerInfo => props => <ExplorerInfo {...props} renderContent={renderContent} />
);
