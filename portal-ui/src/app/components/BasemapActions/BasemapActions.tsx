import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Basemap } from '../../services/data/basemaps/basemaps.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { BasemapActionsDelete } from './Delete/BasemapActions-Delete';
import { BasemapActionsEdit } from './Edit/BasemapActions-Edit';

const cnBasemapActions = cn('BasemapActions');

interface BasemapActionsProps {
  basemap: Basemap;
}

export const BasemapActions: FC<BasemapActionsProps> = ({ basemap }) => (
  <div className={cnBasemapActions()}>
    {currentUser.isAdmin && <BasemapActionsEdit as='iconButton' basemap={basemap} />}
    {currentUser.isAdmin && <BasemapActionsDelete basemap={basemap} />}
  </div>
);
