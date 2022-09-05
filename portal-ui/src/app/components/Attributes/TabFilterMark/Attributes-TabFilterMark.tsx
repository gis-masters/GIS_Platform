import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { FilterFeaturesOutlined } from '../../Icons/FilterFeaturesOutlined';

import '!style-loader!css-loader!sass-loader!./Attributes-TabFilterMark.scss';

const cnAttributesTabFilterMark = cn('Attributes', 'TabFilterMark');

export const AttributesTabFilterMark: FC = () => (
  <Tooltip title='Включен фильтр карты для этого слоя'>
    <span>
      <FilterFeaturesOutlined className={cnAttributesTabFilterMark()} fontSize='small' />
    </span>
  </Tooltip>
);
