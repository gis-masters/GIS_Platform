import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { Basemap } from '../../services/data/basemaps.models';

import { BasemapActionsDelete } from './Delete/BasemapActions-Delete';

const cnBasemapActions = cn('BasemapActions');

interface BasemapActionsProps {
  basemap: Basemap;
}

export const BasemapActions: FC<BasemapActionsProps> = ({ basemap }) => (
  <div className={cnBasemapActions()}>{currentUser.isAdmin && <BasemapActionsDelete basemap={basemap} />}</div>
);
