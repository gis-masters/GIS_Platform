import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./PickupDataset-SelectedTitle.scss';

const cnPickupDatasetsSelectedTitle = cn('PickupDatasets', 'SelectedTitle');

export const PickupDatasetSelectedTitle: FC = () => (
  <span className={cnPickupDatasetsSelectedTitle()}>Выбран набор:</span>
);
