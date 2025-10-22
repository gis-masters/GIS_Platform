import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './PickupDataset-SelectedTitle.scss';

const cnPickupDatasetsSelectedTitle = cn('PickupDatasets', 'SelectedTitle');

export const PickupDatasetSelectedTitle: FC = () => (
  <span className={cnPickupDatasetsSelectedTitle()}>Выбран набор:</span>
);
