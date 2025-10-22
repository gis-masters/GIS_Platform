import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { printSettings } from '../../../stores/PrintSettings.store';

import './SelectLegend-Count.scss';

const cnSelectLegendCount = cn('SelectLegend', 'Count');

export const SelectLegendCount: FC = () => (
  <span className={cnSelectLegendCount()}>(выбрано {printSettings.legend.items.length})</span>
);
