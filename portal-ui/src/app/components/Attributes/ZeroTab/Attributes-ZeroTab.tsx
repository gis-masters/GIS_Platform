import React, { type FC } from 'react';
import { Tab, type TabProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import './Attributes-ZeroTab.scss';

const cnAttributesZeroTab = cn('Attributes', 'ZeroTab');

export const AttributesZeroTab: FC<TabProps> = ({ className }) => (
  <Tab className={cnAttributesZeroTab(null, [className])} />
);
