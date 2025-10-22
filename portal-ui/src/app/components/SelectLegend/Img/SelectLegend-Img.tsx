import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type StyleRuleExtended } from '../../../services/geoserver/styles/styles.models';

const cnSelectLegendImg = cn('SelectLegend', 'Img');

interface SelectLegendImgProps {
  rowData: StyleRuleExtended;
}

export const SelectLegendImg: FC<SelectLegendImgProps> = ({ rowData }) => (
  <img className={cnSelectLegendImg()} src={rowData.legend} />
);
