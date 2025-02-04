import React, { FC } from 'react';
import { Tab, TabProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Attributes-ZeroTab.scss';

const cnAttributesZeroTab = cn('Attributes', 'ZeroTab');

export const AttributesZeroTab: FC<TabProps> = ({ className }) => (
  <Tab className={cnAttributesZeroTab(null, [className])} />
);
